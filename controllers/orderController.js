const Order = require('../models/Order');
const Event = require('../models/Event');

// @desc    Obtener órdenes del usuario autenticado
// @route   GET /api/orders/mis-ordenes
const getMyOrders = async (req, res) => {
  try {
    // Buscar órdenes asociadas al usuario autenticado, popular evento con campos específicos y ordenar por fecha de creación descendente
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

    // 1. Validar stock y descontarlo en una sola operación atómica
    //    Esto evita race conditions cuando dos usuarios compran al mismo tiempo.
    const evento = await Event.findOneAndUpdate(
      { _id: eventId, stock: { $gte: cantidad } },
      { $inc: { stock: -cantidad } },
      { new: true }
    );

    if (!evento) {
      // Diferenciar entre "evento no existe" y "stock insuficiente"
      const exists = await Event.findById(eventId);
      if (!exists) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
      }
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    // 2. Generar número de orden con mayor rango para evitar colisiones
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const numeroOrden = `VOY-${timestamp}-${random}`;

    // 3. Crear y guardar la orden en la base de datos
    const order = await Order.create({
      userId: req.user._id,
      eventId,
      cantidad,
      datosComprador,
      subtotal,
      total,
      numeroOrden
    });

    // 4. Responder al frontend con la orden creada
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la orden' });
  }
};

module.exports = { getMyOrders, createOrder };
