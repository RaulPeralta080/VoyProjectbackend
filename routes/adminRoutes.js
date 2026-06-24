const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, getMetrics, toggleFeatureEvent, deleteEventAdmin } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Todas las rutas requieren login y ser admin
router.use(protect, authorizeRoles('admin'));

router.get('/users', getUsers);
router.put('/users/:id', updateUserStatus);
router.get('/metrics', getMetrics);
router.put('/events/:id/feature', toggleFeatureEvent);
router.delete('/events/:id', deleteEventAdmin);

module.exports = router;
