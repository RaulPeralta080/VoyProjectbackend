const express = require('express');
const router  = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/',    getEvents);     // GET /api/events
router.get('/:id', getEventById); // GET /api/events/:id

// Rutas protegidas de escritura de eventos (solo productores y administradores)
router.post('/',     authorizeRoles('producer', 'admin'), createEvent);
router.put('/:id',    authorizeRoles('producer', 'admin'), updateEvent);
router.delete('/:id', authorizeRoles('producer', 'admin'), deleteEvent);

module.exports = router;