const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, getMetrics, toggleFeatureEvent, deleteEventAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Todas las rutas requieren login (protect) y ser admin (admin)
router.use(protect, admin);

router.get('/users', getUsers);
router.put('/users/:id', updateUserStatus);
router.get('/metrics', getMetrics);
router.put('/events/:id/feature', toggleFeatureEvent);
router.delete('/events/:id', deleteEventAdmin);

module.exports = router;
