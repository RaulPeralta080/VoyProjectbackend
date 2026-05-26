const express = require('express');
const router  = express.Router();
const { getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/mis-ordenes', protect, getMyOrders);

module.exports = router;
