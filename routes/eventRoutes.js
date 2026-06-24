const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Tu config de Cloudinary
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { 
  getEvents, getEventById,
  getMyEvents, createEvent, updateEvent, 
  pauseEvent, cancelEvent, deleteEvent 
} = require('../controllers/eventController');

// Rutas Públicas (Cualquier usuario puede ver eventos)
router.get('/', getEvents);
router.get('/:id', getEventById);

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