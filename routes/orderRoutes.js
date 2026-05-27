const express = require('express');
const router  = express.Router();
const { getMyOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/orders/mis-ordenes
router.get('/mis-ordenes', protect, getMyOrders);

// POST /api/orders
router.post('/', protect, createOrder);

module.exports = router;