const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrar usuario
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, complete todos los campos' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ mensaje: 'El email ya está registrado' });
  }

  const user = await User.create({ nombre, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id)
    });
  }
};

//Login de usuario
//POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password'); // Traemos el password solo para comparar

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    // Mensaje genérico por seguridad
    res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
  }
};

module.exports = { registerUser, loginUser };