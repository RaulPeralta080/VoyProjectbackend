const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};

// @desc    Actualizar perfil del usuario logueado
// @route   PUT /api/users/me
// @access  Privado (JWT)
const updateUserProfile = async (req, res) => {
  try {
    const whitelist = ['nombre', 'username', 'perfilPublico'];
    const updates = {};

    // Validar y limpiar campos a actualizar
    for (const key of Object.keys(req.body)) {
      if (whitelist.includes(key)) {
        if (key === 'username') {
          const cleanedUsername = req.body.username.trim().toLowerCase();
          
          // Validación básica de formato para username
          if (!/^[a-zA-Z0-9._]+$/.test(cleanedUsername)) {
            return res.status(400).json({ mensaje: 'Nombre de usuario inválido. Solo letras, números, puntos y guión bajo.' });
          }

          // Verificar si ya está en uso por otro usuario
          const existingUser = await User.findOne({ username: cleanedUsername });
          if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
          }
          
          updates[key] = cleanedUsername;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ mensaje: 'No hay campos válidos para actualizar' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};

// @desc    Obtener perfil público de un usuario por username
// @route   GET /api/users/:username
// @access  Público
const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Si el perfil no es público, retornar 403 Forbidden
    if (user.perfilPublico === false) {
      return res.status(403).json({ mensaje: 'Acceso denegado, este perfil es privado' });
    }

    // Retornar solo campos públicos y excluir información privada (email, password)
    const publicProfile = {
      _id: user._id,
      nombre: user.nombre,
      username: user.username,
      seguidores: user.seguidores,
      siguiendo: user.siguiendo,
      createdAt: user.createdAt
    };

    res.json(publicProfile);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil público' });
  }
};

// @desc    Verificar disponibilidad de un nombre de usuario
// @route   GET /api/users/check-username/:username
// @access  Privado (JWT)
const checkUsername = async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      return res.status(400).json({ mensaje: 'Nombre de usuario inválido. Solo letras, números, puntos y guión bajo.' });
    }

    const user = await User.findOne({ username });
    res.json({ disponible: !user });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar el nombre de usuario' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  checkUsername
};
