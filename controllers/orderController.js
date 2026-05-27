const Order = require('../models/Order');
const Event = require('../models/Event');


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('eventId', 'nombre fecha lugar')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las órdenes' });
  }
};


const createOrder = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador, subtotal, total } = req.body;

    // 1. Validar que el evento exista
    const evento = await Event.findById(eventId);
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    // 2. Validar que el stock sea suficiente
    if (evento.stock < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    // 3. Generar el numero de orden (
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const numeroOrden = `VOY-${randomDigits}`;

    // 4. Crear y guardar la orden en la base de datos
    const order = await Order.create({
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal,
      total,
      numeroOrden
    });

    // 5. Descontar el stock del evento y guardar los cambios
    evento.stock -= cantidad;
    await evento.save();

    // 6. Responder al frontend con la orden creada
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la orden' });
  }
};

module.exports = { getMyOrders, createOrder };