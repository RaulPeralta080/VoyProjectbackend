const express = require('express');
const router  = express.Router();
<<<<<<< HEAD
const { getMyOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/orders/mis-ordenes
router.get('/mis-ordenes', protect, getMyOrders);

// POST /api/orders
router.post('/', protect, createOrder);

module.exports = router;
=======
const { getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/mis-ordenes', protect, getMyOrders);

module.exports = router;
>>>>>>> 5ca3f5c94fa93eae54057201ae84b7f8bae98f6b
