const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Tu config de Cloudinary
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { 
  getEvents, getEventById,
  getMyEvents, createEvent, updateEvent, 
  pauseEvent, cancelEvent, deleteEvent,
  addComment, deleteComment
} = require('../controllers/eventController');

// Rutas Públicas (Cualquier usuario puede ver eventos)
router.get('/', getEvents);

// Ruta pública para limpieza automática de eventos de prueba (Cypress E2E)
router.delete('/cleanup/test-data', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const User = require('../models/User');
    const eventResult = await Event.deleteMany({
      $or: [
        { nombre: { $regex: /cypress|test|productora|festival/i } },
        { title: { $regex: /cypress|test|productora|festival/i } }
      ]
    });
    const userResult = await User.deleteMany({
      $or: [
        { email: { $regex: /test|fan|productora|demo/i } },
        { username: { $regex: /test|fan|productora|demo|rock/i } },
        { nombre: { $regex: /test|fan|productora|demo/i } }
      ]
    });
    res.json({ mensaje: 'Limpieza de datos de prueba completada', eventos: eventResult.deletedCount, usuarios: userResult.deletedCount });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al limpiar datos de prueba', error: err.message });
  }
});

router.get('/:id', getEventById);

// Rutas para cualquier usuario autenticado (Comentarios)
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

// Rutas protegidas para el productor y admin
// Todas las rutas de escritura requieren login y ser productor o admin
router.use(protect, authorizeRoles('producer', 'admin'));

router.get('/producer/my-events', getMyEvents);
router.post('/', upload.single('imagen'), createEvent); // Intercepta archivo
router.put('/:id', updateEvent);
router.patch('/:id/pause', pauseEvent);
router.patch('/:id/cancel', cancelEvent);
router.delete('/:id', deleteEvent);

module.exports = router;