const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middlewares/authMiddleware');

// Aplicamos el middleware a todas las rutas de administración
router.use(authorizeRoles('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', (req, res) => {
  res.status(200).json({ 
    mensaje: 'Acceso concedido al panel de administración', 
    user: {
      _id: req.user._id,
      nombre: req.user.nombre,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
