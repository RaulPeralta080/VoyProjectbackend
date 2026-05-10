const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controllers/eventController');

// GET /api/eventos (siempre revisen las carpetas muchcachos)
router.get('/', getEvents);

// GET /api/events/:id (detalle completo para card máxima)
router.get('/:id', getEventById);

module.exports = router;