const express = require('express');
const router = express.Router();
const { getEvents } = require('../controllers/eventController');

// GET /api/eventos (siempre revisen las carpetas muchcachos)
router.get('/', getEvents);

module.exports = router;