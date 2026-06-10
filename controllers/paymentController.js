const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Event = require('../models/Event');

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear preferencia de MercadoPago y guardar orden pendiente 
const createPreference = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador } = req.body;

    const evento = await Event.findById(eventId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    // Generamos el ID de la orden ANTES para mandarlo a MP como external_reference
    const orderId = new mongoose.Types.ObjectId();

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
        payer: {
          name: datosComprador.nombre,
          surname: datosComprador.apellido,
          email: datosComprador.email
        },
        external_reference: orderId.toString(),
        // NGROK_URL vendrá de tu .env cuando lo pruebes localmente
        notification_url: process.env.NGROK_URL ? `${process.env.NGROK_URL}/api/payments/webhook` : undefined,
        back_urls: {
          success: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/compra/confirmacion` : 'http://localhost:5173/compra/confirmacion',
          failure: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/` : 'http://localhost:5173/',
          pending: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/` : 'http://localhost:5173/',
        },
        ...(process.env.FRONTEND_URL && { auto_return: 'approved' })
      }
    });

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const totalCalculado = evento.precio * cantidad;

    await Order.create({
      _id: orderId, // Usamos el ID generado
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal: totalCalculado,
      total: totalCalculado,
      numeroOrden: `VOY-${timestamp}-${random}`,
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
    res.status(500).json({ mensaje: 'Error al generar preferencia de pago' });
  }
};

// Recibir notificaciones de Mercado Pago (Webhook)

const receiveWebhook = async (req, res) => {
  // 1. Criterio de aceptación: Responder 200 OK inmediatamente a MP
  res.status(200).send('OK');

  try {
    const { type, data } = req.body;

    // 2. Solo procesamos si el tipo de notificación es un pago
    if (type === 'payment') {
      // Consultar el estado real del pago con el SDK
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.id });

      const { status, external_reference } = paymentInfo;

      if (!external_reference) return; // Si no hay referencia, no es una orden nuestra

      // 3. Mapear estados de MP a nuestro Enum
      let nuevoEstado = 'PENDIENTE';
      if (status === 'approved') nuevoEstado = 'PAGADA';
      else if (status === 'rejected') nuevoEstado = 'RECHAZADA';
      else if (status === 'in_process') nuevoEstado = 'EN_PROCESO';

      // 4. Buscar la orden en la BD
      const order = await Order.findById(external_reference);
      if (!order) return;

      const estadoAnterior = order.estadoPago;

      // Actualizar datos de pago
      order.estadoPago = nuevoEstado;
      order.mpPaymentId = data.id.toString();

      // 5. Criterio de aceptación: Idempotencia en el descuento de stock
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