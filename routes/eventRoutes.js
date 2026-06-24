const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Tu config de Cloudinary
const { protect, verifiedProducer, authorizeRoles } = require('../middlewares/authMiddleware');
const { 
  getEvents, getEventById,
  getMyEvents, createEvent, updateEvent, 
  pauseEvent, cancelEvent, deleteEvent 
} = require('../controllers/eventController');

// Rutas públicas
router.get('/', getEvents);
router.get('/:id', getEventById);

// Rutas protegidas para el productor (my-events, pause, cancel)
router.get('/producer/my-events', protect, authorizeRoles('producer'), getMyEvents);
router.patch('/:id/pause', protect, authorizeRoles('producer'), pauseEvent);
router.patch('/:id/cancel', protect, authorizeRoles('producer'), cancelEvent);

// Rutas protegidas de escritura de eventos (solo productores y administradores, con carga de imagen)
router.post('/', protect, authorizeRoles('producer', 'admin'), upload.single('imagen'), createEvent);
router.put('/:id', protect, authorizeRoles('producer', 'admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('producer', 'admin'), deleteEvent);

module.exports = router;