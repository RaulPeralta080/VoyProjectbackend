const express = require('express');
const router = express.Router();
const { createPreference, receiveWebhook } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta protegida (requiere token JWT del usuario)
router.post('/create-preference', protect, createPreference);

// Ruta pública (la consume Mercado Pago directamente, no requiere JWT)
router.post('/webhook', receiveWebhook);

module.exports = router;