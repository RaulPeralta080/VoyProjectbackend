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

const verifiedProducer = (req, res, next) => {
  if (req.user && req.user.rol === 'productor') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol de productor' });
};

const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol de administrador' });
};

module.exports = { protect, verifiedProducer, admin };