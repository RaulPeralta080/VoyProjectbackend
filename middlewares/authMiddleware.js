/*
 * Middleware de Autenticación y Control de Acceso mediante JWT
 * Valida los tokens Bearer adjuntos en las cabeceras HTTP, decodifica el payload
 * e inyecta la instancia del usuario autenticado en la petición (req.user).
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ mensaje: 'No autorizado, usuario no encontrado' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado, no hay token' });
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
          return res.status(403).json({ mensaje: 'Acceso prohibido: token inválido o vencido' });
        }
      }
    }

    if (!req.user) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: se requiere token' });
    }

    if (req.user.isSuspended) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: cuenta suspendida' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: rol no autorizado' });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };