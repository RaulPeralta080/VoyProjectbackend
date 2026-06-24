const User = require('../models/User');
const Event = require('../models/Event');
const Order = require('../models/Order');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { role, isSuspended, isVerifiedProducer } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isSuspended, isVerifiedProducer },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

const getMetrics = async (req, res) => {
  try {
    // Suma ventas y recaudación solo de órdenes PAGADA
    const metrics = await Order.aggregate([
      { $match: { estadoPago: 'PAGADA' } },
      { 
        $group: { 
          _id: null, 
          ventasTotales: { $sum: 1 }, 
          recaudacion: { $sum: '$total' } 
        } 
      }
    ]);

    res.json(metrics.length > 0 ? metrics[0] : { ventasTotales: 0, recaudacion: 0 });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener métricas' });
  }
};

const toggleFeatureEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    event.destacado = !event.destacado;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al destacar evento' });
  }
};

const deleteEventAdmin = async (req, res) => {
  try {
    // Admin borra sin restricción de autoría
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento eliminado por administrador' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
};

module.exports = { getUsers, updateUserStatus, getMetrics, toggleFeatureEvent, deleteEventAdmin };