const Order = require('../models/Order');
const Event = require('../models/Event');
const { fetchUserOrders, findOrderById } = require('../services/orderService');

const getMyOrders = async (req, res) => {
  try {
    const orders = await fetchUserOrders(req.user._id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las órdenes' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { eventId, cantidad, datosComprador, subtotal, total, metodoPago } = req.body;

    const id = eventId || req.body.eventoId;
    const evento = await Event.findById(id);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    // Mapeo seguro de método de pago si viene del frontend
    let metodoNormalizado = metodoPago || 'efectivo';
    if (metodoNormalizado === 'Pago en Puerta') metodoNormalizado = 'efectivo';
    if (metodoNormalizado === 'Pago por QR') metodoNormalizado = 'transferencia';
    if (metodoNormalizado === 'MercadoPago') metodoNormalizado = 'mercadopago';

    // 2. Generar número de orden simple y legible (ej. VOY-84920)
    const random = Math.floor(10000 + Math.random() * 90000);
    const numeroOrden = `VOY-${random}`;

    // 3. Crear y guardar la orden recalculando total correctamente si viene 0
    const precioEvento = evento.precio || 0;
    const cant = Number(cantidad) || 1;
    const calcTotal = (typeof total === 'number' && total > 0) ? total : (precioEvento * cant);
    const calcSubtotal = (typeof subtotal === 'number' && subtotal > 0) ? subtotal : calcTotal;

    const order = await Order.create({
      userId: req.user._id,
      eventId: id,
      cantidad: cant,
      datosComprador: {
        nombre: datosComprador?.nombre || req.body.nombre || req.user.nombre || 'Usuario',
        apellido: datosComprador?.apellido || req.body.apellido || 'VOY',
        email: datosComprador?.email || req.body.email || req.user.email || 'usuario@voy.com',
        dni: datosComprador?.dni || req.body.dni || '0',
      },
      subtotal: calcSubtotal,
      total: calcTotal,
      numeroOrden,
      metodoPago: metodoNormalizado,
      estadoPago: 'PENDIENTE' 
    });

    // 4. Descontar stock para métodos directos (efectivo/transferencia en puerta/QR)
    if (metodoNormalizado !== 'mercadopago') {
      await Event.findByIdAndUpdate(id, {
        $inc: { stock: -cant }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('[createOrder error]:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear la orden', 
      detalle: error.message || error.toString() 
    });
  }
};

module.exports = { getMyOrders, createOrder, getOrderById };