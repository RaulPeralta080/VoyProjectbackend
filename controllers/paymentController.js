/*
 * Integración con MercadoPago (Checkout y Webhooks)
 * Genera la preferencia de pago mediante el SDK oficial y procesa las
 * notificaciones Webhook entrantes actualizando el estado de la orden y
 * descontando el stock correspondiente de forma idempotente.
 */

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Event = require('../models/Event');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const createPreference = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador } = req.body;

    const evento = await Event.findById(eventId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

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

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const totalCalculado = evento.precio * cantidad;

    await Order.create({
      _id: orderId,
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal: totalCalculado,
      total: totalCalculado,
      numeroOrden: `VOY-${random}`,
      estadoPago: 'PENDIENTE',
      metodoPago: 'mercadopago',
      mpPreferenceId: result.id
    });

    res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point
    });

  } catch (error) {
    console.error('Error en createPreference:', error);
    res.status(500).json({
      mensaje: 'Error al generar preferencia de pago',
      detalle: error.message || error.cause || JSON.stringify(error)
    });
  }
};

const receiveWebhook = async (req, res) => {
  res.status(200).send('OK');

  try {
    const { type, data, action } = req.body;

    if (type === 'payment' || action?.startsWith('payment') || req.query.topic === 'payment' || req.body.resource) {
      let paymentId = data?.id || req.query.id || req.body.id;

      if (!paymentId && req.body.resource) {
        paymentId = req.body.resource.split('/').pop();
      }

      if (!paymentId) return;

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
      if (data?.id) {
        order.mpPaymentId = data.id.toString();
      }

      if (nuevoEstado === 'PAGADA' && estadoAnterior !== 'PAGADA') {
        await Event.findByIdAndUpdate(order.eventId, {
          $inc: { stock: -order.cantidad }
        });
      }

      await order.save();
    }
  } catch (error) {
    console.error('Error procesando webhook de MP:', error.message);
  }
};

module.exports = { createPreference, receiveWebhook };