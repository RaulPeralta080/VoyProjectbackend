const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario y lo inyectamos en la petición (sin el password)
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      // return evita que el código siga y genere una doble respuesta
      return res.status(401).json({ mensaje: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado, no hay token' });
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    // Si req.user aún no está definido, intentamos autenticar con el token
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

    // Si después de verificar no hay usuario, retornamos 403 Forbidden
    if (!req.user) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: se requiere token' });
    }

    // Si el usuario está suspendido, denegar acceso
    if (req.user.isSuspended) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: cuenta suspendida' });
    }

    // Validar el rol
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ mensaje: 'Acceso prohibido: rol no autorizado' });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };