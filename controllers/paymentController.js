const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Order = require('../models/Order');
const Event = require('../models/Event');

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear preferencia de MercadoPago y guardar orden pendiente (soporta pago web standard y pago con QR)
const createPreference = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador, isQr, metodoPago } = req.body;

    const evento = await Event.findById(eventId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    // Generamos el ID de la orden ANTES para mandarlo a MP como external_reference
    const orderId = new mongoose.Types.ObjectId();

    const baseUrl = (process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim() !== '')
      ? process.env.FRONTEND_URL.replace(/\/$/, '')
      : 'http://localhost:5173';

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: evento._id.toString(),
            title: evento.nombre,
            quantity: Number(cantidad),
            unit_price: Number(evento.precio),
            currency_id: 'ARS',
          }
        ],
        external_reference: orderId.toString(),
        back_urls: {
          success: `${baseUrl}/compra/confirmacion`,
          failure: `${baseUrl}/`,
          pending: `${baseUrl}/`
        },
        ...(baseUrl.includes('localhost') ? {} : { auto_return: 'approved' })
      }
    });

    // Generar representación QR dinámico en Base64 para escaneo desde app MP / celular
    let qrCodeDataUrl = null;
    if (result.init_point) {
      qrCodeDataUrl = await QRCode.toDataURL(result.init_point, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 350
      });
    }

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const totalCalculado = evento.precio * cantidad;
    
    // Definir método de pago normalizado
    const esQr = isQr || metodoPago === 'qr_mercadopago' || metodoPago === 'Pago por QR' || req.path.includes('qr');
    const metodoPagoFinal = esQr ? 'qr_mercadopago' : 'mercadopago';

    const newOrder = await Order.create({
      _id: orderId,
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal: totalCalculado,
      total: totalCalculado,
      numeroOrden: `VOY-${timestamp}-${random}`,
      estadoPago: 'PENDIENTE',
      metodoPago: metodoPagoFinal,
      mpPreferenceId: result.id,
      qrCodeUrl: qrCodeDataUrl
    });

    res.status(200).json({
      orderId: newOrder._id.toString(),
      numeroOrden: newOrder.numeroOrden,
      preferenceId: result.id,
      initPoint: result.init_point,
      qrCode: qrCodeDataUrl
    });

  } catch (error) {
    console.error('Error en createPreference:', error);
    res.status(500).json({
      mensaje: 'Error al generar preferencia de pago',
      detalle: error.message || error.cause || JSON.stringify(error)
    });
  }
};

// Endpoint específico para generar QR de Mercado Pago
const createQRPreference = async (req, res) => {
  req.body.isQr = true;
  return createPreference(req, res);
};

// Endpoint para consultar el estado del pago de una orden
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('eventId', 'nombre fecha hora lugar imagen');

    if (!order) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    if (order.userId.toString() !== req.user._id.toString() && req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes autorización para acceder a esta orden' });
    }

    res.status(200).json({
      orderId: order._id,
      numeroOrden: order.numeroOrden,
      estadoPago: order.estadoPago,
      metodoPago: order.metodoPago,
      total: order.total,
      cantidad: order.cantidad,
      datosComprador: order.datosComprador,
      evento: order.eventId,
      qrCodeUrl: order.qrCodeUrl,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error('Error en getOrderStatus:', error);
    res.status(500).json({
      mensaje: 'Error al consultar estado de la orden',
      detalle: error.message
    });
  }
};

// Recibir notificaciones de Mercado Pago (Webhook)
const receiveWebhook = async (req, res) => {
  // Responder 200 OK inmediatamente a MP
  res.status(200).send('OK');

  console.log('--- WEBHOOK RECIBIDO DE MERCADOPAGO ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));

  try {
    const { type, data, action } = req.body;

    if (type === 'payment' || action?.startsWith('payment') || req.query.topic === 'payment' || req.body.resource || req.query['data.id']) {
      let paymentId = data?.id || req.query.id || req.body.id || req.query['data.id'];

      if (!paymentId && req.body.resource) {
        paymentId = req.body.resource.split('/').pop();
      }

      if (!paymentId) return;

      console.log('Consultando estado del pago ID:', paymentId);
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      const { status, external_reference } = paymentInfo;

      if (!external_reference) return;

      let nuevoEstado = 'PENDIENTE';
      if (status === 'approved') nuevoEstado = 'PAGADA';
      else if (status === 'rejected') nuevoEstado = 'RECHAZADA';
      else if (status === 'in_process') nuevoEstado = 'EN_PROCESO';

      const order = await Order.findById(external_reference);
      if (!order) return;

      const estadoAnterior = order.estadoPago;

      order.estadoPago = nuevoEstado;
      order.mpPaymentId = paymentId.toString();

      // Idempotencia en el descuento de stock
      if (nuevoEstado === 'PAGADA' && estadoAnterior !== 'PAGADA') {
        await Event.findByIdAndUpdate(order.eventId, {
          $inc: { stock: -order.cantidad }
        });
      }

      await order.save();
      console.log(`Orden ${order._id} actualizada a estado: ${nuevoEstado}`);
    }
  } catch (error) {
    console.error('Error procesando webhook de MP:', error.message);
  }
};

module.exports = { createPreference, createQRPreference, getOrderStatus, receiveWebhook };