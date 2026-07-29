const express = require('express');
const router = express.Router();
const { createPreference, createQRPreference, getOrderStatus, receiveWebhook } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas protegidas (requieren token JWT del usuario)
router.post('/create-preference', protect, createPreference);
router.post('/create-qr-preference', protect, createQRPreference);
router.get('/status/:orderId', protect, getOrderStatus);

// Ruta pública (la consume Mercado Pago directamente, no requiere JWT)
router.post('/webhook', receiveWebhook);

module.exports = router;