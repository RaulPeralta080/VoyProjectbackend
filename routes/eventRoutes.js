const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { getEvents } = require('../controllers/eventController');
=======
const { getEvents, getEventById } = require('../controllers/eventController');
>>>>>>> dfffbefead421cc154dcb2300e569dd5935f1fd3

// GET /api/eventos (siempre revisen las carpetas muchcachos)
router.get('/', getEvents);

<<<<<<< HEAD
=======
// GET /api/events/:id (detalle completo para card máxima)
router.get('/:id', getEventById);

>>>>>>> dfffbefead421cc154dcb2300e569dd5935f1fd3
module.exports = router;