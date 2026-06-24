const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ mensaje: 'No autorizado, usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const whitelist = [
      'nombre',
      'username',
      'perfilPublico',
      'avatar',
      'bio',
      'ubicacion',
      'role',
      'redesSociales',
      'favoritos',
      'avatarColor',
      'bannerGradiente',
      'generosMusicales',
      'vibeEnShows'
    ];
    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (whitelist.includes(key)) {
        if (key === 'username') {
          const rawUsername = req.body.username;
          if (rawUsername === undefined || rawUsername === null || rawUsername.trim() === '') {
            if (req.user.username) {
              return res.status(400).json({ mensaje: 'El nombre de usuario es obligatorio.' });
            }
            // Si no tiene, no lo agregamos a updates para evitar guardar "" y causar conflicto de índice único
          } else {
            const cleanedUsername = rawUsername.trim().toLowerCase();
            
            if (!/^[a-zA-Z0-9._]+$/.test(cleanedUsername)) {
              return res.status(400).json({ mensaje: 'Nombre de usuario inválido. Solo letras, números, puntos y guión bajo.' });
            }

            const existingUser = await User.findOne({ username: cleanedUsername });
            if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
              return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            }
            
            updates[key] = cleanedUsername;
          }
        } else if (key === 'role') {
          if (req.body.role === 'producer' || req.body.role === 'client' || req.body.role === 'admin') {
            // Permitimos admin temporalmente porque el frontend hace la llamada con rol admin al inicio
            updates[key] = req.body.role;
          }
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
    res.status(500).json({ mensaje: 'Error al actualizar el perfil', error: error.message, stack: error.stack });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const param = req.params.username.trim().toLowerCase();
    
    let query = { username: param };
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(param)) {
      query = { $or: [{ _id: param }, { username: param }] };
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (user.perfilPublico === false) {
      return res.status(403).json({ mensaje: 'Acceso denegado, este perfil es privado' });
    }

    const publicProfile = {
      _id: user._id,
      nombre: user.nombre,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      ubicacion: user.ubicacion,
      rol: user.rol,
      redesSociales: user.redesSociales,
      seguidores: user.seguidores,
      siguiendo: user.siguiendo,
      favoritos: user.favoritos,
      avatarColor: user.avatarColor,
      bannerGradiente: user.bannerGradiente,
      vibeEnShows: user.vibeEnShows,
      createdAt: user.createdAt
    };

    res.json(publicProfile);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil público' });
  }
};

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

const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const loggedUserId = req.user._id;

    if (loggedUserId.toString() === targetId.toString()) {
      return res.status(400).json({ mensaje: 'No puedes seguirte a ti mismo' });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (targetUser.seguidores.includes(loggedUserId)) {
      return res.status(400).json({ mensaje: 'Ya sigues a este usuario' });
    }

    await User.findByIdAndUpdate(loggedUserId, { $addToSet: { siguiendo: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { seguidores: loggedUserId } });

    res.json({ mensaje: 'Usuario seguido correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al seguir al usuario' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const loggedUserId = req.user._id;

    if (loggedUserId.toString() === targetId.toString()) {
      return res.status(400).json({ mensaje: 'No puedes dejar de seguirte a ti mismo' });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!targetUser.seguidores.includes(loggedUserId)) {
      return res.status(400).json({ mensaje: 'No sigues a este usuario' });
    }

    await User.findByIdAndUpdate(loggedUserId, { $pull: { siguiendo: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { seguidores: loggedUserId } });

    res.json({ mensaje: 'Usuario dejado de seguir correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al dejar de seguir al usuario' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const eventId = req.params.eventId;
    const index = user.favoritos.indexOf(eventId);
    
    if (index === -1) {
      user.favoritos.push(eventId);
    } else {
      user.favoritos.splice(index, 1);
    }

    await user.save();
    res.json({ favoritos: user.favoritos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar favoritos' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  checkUsername,
  followUser,
  unfollowUser,
  toggleFavorite
};
