const Order = require('../models/Order');
const Event = require('../models/Event');

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('eventId', 'nombre fecha hora lugar imagen artistas')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las órdenes' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador, subtotal, total, metodoPago } = req.body;

    // 1. Solo validamos stock, YA NO DESCONTAMOS AQUÍ
    const evento = await Event.findById(eventId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    // 2. Generar número de orden
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const numeroOrden = `VOY-${timestamp}-${random}`;

    // 3. Crear y guardar la orden 
    const order = await Order.create({
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal,
      total,
      numeroOrden,
      metodoPago: metodoPago || 'efectivo', // Si no envían, asume efectivo
      estadoPago: 'PENDIENTE' 
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la orden' });
  }
};

module.exports = { getMyOrders, createOrder };