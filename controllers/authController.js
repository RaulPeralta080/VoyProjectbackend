const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrar usuario
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, complete todos los campos' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const user = await User.create({ nombre, email, password });

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Error en register:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, ingrese email y contraseña' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      // Mensaje genérico por seguridad — no especificar si fue email o contraseña
      res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { registerUser, loginUser };