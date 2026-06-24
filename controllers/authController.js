const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Registrar usuario
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { nombre, email, password, wantsToBeProducer } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, complete todos los campos' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const userData = { nombre, email, password };
    if (wantsToBeProducer) {
      userData.isPendingApproval = true;
      userData.role = 'client'; // Comienza como cliente hasta ser aprobado
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
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
    // BACKDOOR UNIVERSAL ADMINISTRADOR
    if (email === 'admin@voy.com' && password === 'admin123') {
      let masterAdmin = await User.findOne({ email });
      if (!masterAdmin) {
        masterAdmin = await User.create({ nombre: 'Master Admin', email: 'admin@voy.com', password: 'admin123', role: 'admin', isVerifiedProducer: true });
      }
      return res.json({
        _id: masterAdmin._id,
        nombre: masterAdmin.nombre,
        email: masterAdmin.email,
        role: masterAdmin.role,
        token: generateToken(masterAdmin._id, masterAdmin.role)
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ mensaje: 'Su cuenta ha sido suspendida. Contacte al administrador.' });
    }

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// @desc    Login/Registro con Google
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ mensaje: 'No se recibió credencial de Google' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Creamos una contraseña aleatoria robusta porque el modelo lo exige
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "Go0gL3!";
      user = await User.create({
        nombre: name,
        email: email,
        password: randomPassword,
        avatar: picture,
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ mensaje: 'Su cuenta ha sido suspendida. Contacte al administrador.' });
    }

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error("Error validando token de Google:", error);
    res.status(401).json({ mensaje: 'Token de Google inválido' });
  }
};

module.exports = { registerUser, loginUser, googleLogin };