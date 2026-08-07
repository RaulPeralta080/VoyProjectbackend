const Order = require('../models/Order');

const fetchUserOrders = async (userId) => {
  return await Order.find({ userId })
    .populate('eventId', 'nombre fecha hora lugar imagen artistas')
    .sort({ createdAt: -1 });
};

const findOrderById = async (id) => {
  return await Order.findById(id)
    .populate('eventId', 'nombre fecha hora lugar imagen artistas precio generos stock')
    .populate('userId', 'nombre email');
};

module.exports = {
  fetchUserOrders,
  findOrderById
};
