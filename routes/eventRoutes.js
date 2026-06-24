const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Tu config de Cloudinary
const { protect, verifiedProducer } = require('../middlewares/authMiddleware');
const { 
  getEvents, getEventById,
  getMyEvents, createEvent, updateEvent, 
  pauseEvent, cancelEvent, deleteEvent 
} = require('../controllers/eventController');

// Rutas públicas
router.get('/', getEvents);
router.get('/:id', getEventById);

// Rutas protegidas para el productor (Requiere login y estar verificado)
router.use(protect, verifiedProducer);

router.get('/producer/my-events', getMyEvents);
router.post('/', upload.single('imagen'), createEvent); // Intercepta archivo
router.put('/:id', updateEvent);
router.patch('/:id/pause', pauseEvent);
router.patch('/:id/cancel', cancelEvent);
router.delete('/:id', deleteEvent);

module.exports = router;