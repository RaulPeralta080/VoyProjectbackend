const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const { findUserByEmail, findUserByUsername, generateUniqueUsername } = require('../services/authService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Registrar usuario
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { nombre, email, password, role, username } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Complete todos los campos requeridos.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const userExists = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ mensaje: 'Este email ya está registrado. Usá otro email o iniciá sesión.' });
    }

    let finalUsername = "";
    if (username && username.trim()) {
      const cleanUsername = username.trim().toLowerCase();
      const usernameExists = await findUserByUsername(cleanUsername);
      if (usernameExists) {
        return res.status(400).json({ mensaje: `El nombre de usuario @${cleanUsername} ya está en uso. Elegí otro.` });
      }
      finalUsername = cleanUsername;
    } else {
      // Generar automáticamente un username único para cualquier usuario (Fan, Artista, Productor)
      finalUsername = await generateUniqueUsername(nombre);
    }

    // Role defaults to client if not specified or invalid
    const assignedRole = ['client', 'producer', 'artist'].includes(role) ? role : 'client';
    const userData = {
      nombre: nombre.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      username: finalUsername
    };

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    console.error("[registerUser] Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email o nombre de usuario ya está registrado.' });
    }
    res.status(500).json({ mensaje: 'Error interno al registrar la cuenta.' });
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
      // Verificar si está suspendido
      if (user.isSuspended) {
        return res.status(403).json({ mensaje: 'Su cuenta ha sido suspendida. Contacte soporte.' });
      }

      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }
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

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "Go0gL3!";
      user = await User.create({
        nombre: name,
        email: email,
        password: randomPassword,
        avatar: picture || null,
        avatarUrl: picture || null,
        fotoPerfil: picture || null,
        role: 'client',
        onboardingCompleted: false
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ mensaje: 'Su cuenta ha sido suspendida. Contacte al administrador.' });
    }

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role || 'client',
      avatar: user.avatar || user.fotoPerfil || user.avatarUrl || null,
      avatarUrl: user.avatarUrl || user.fotoPerfil || user.avatar || null,
      isPendingApproval: user.isPendingApproval,
      onboardingCompleted: !!user.onboardingCompleted,
      isNewUser: isNewUser || !user.onboardingCompleted,
      token: generateToken(user._id, user.role || 'client')
    });

  } catch (error) {
    console.error("Error validando token de Google:", error);
    res.status(401).json({ mensaje: 'Token de Google inválido' });
  }
};

module.exports = { registerUser, loginUser, googleLogin };