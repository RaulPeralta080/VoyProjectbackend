const Order = require('../models/Order');

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

module.exports = { getMyOrders };
