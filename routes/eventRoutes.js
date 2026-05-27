const express = require('express');
const router  = express.Router();
const { getEvents, getEventById } = require('../controllers/eventController');

router.get('/',    getEvents);     // GET /api/events
router.get('/:id', getEventById); // GET /api/events/:id

module.exports = router;