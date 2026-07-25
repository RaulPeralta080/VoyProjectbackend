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

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('eventId', 'nombre fecha hora lugar imagen artistas precio');
    if (!order) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    if (order.userId.toString() !== req.user._id.toString() && req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver esta orden' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los detalles de la orden' });
  }
};

const createOrder = async (req, res) => {
  try {
    const targetEventId = req.body.eventId || req.body.eventoId;
    const { cantidad = 1, metodoPago, subtotal, total } = req.body;

    if (!targetEventId) {
      return res.status(400).json({ mensaje: 'El ID del evento es obligatorio' });
    }

    // 1. Validar stock
    const evento = await Event.findById(targetEventId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    if (evento.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    // Extraer o estructurar datos del comprador
    const comprador = req.body.datosComprador || req.body.comprador || {
      nombre: req.body.nombre || req.user?.nombre || 'Comprador',
      apellido: req.body.apellido || 'VOY',
      email: req.body.email || req.user?.email || 'comprador@voy.com',
      dni: req.body.dni || 'S/N'
    };

    // Calcular montos si no vienen en la petición
    const subtotalCalculado = Number(subtotal) || (evento.precio * Number(cantidad));
    const totalCalculado = Number(total) || subtotalCalculado;

    // 2. Generar número de orden y ticket QR
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const numeroOrden = `VOY-${timestamp}-${random}`;

    // Normalizar metodoPago
    let normalizedMetodoPago = metodoPago || 'pago_puerta';
    const lowerMetodo = String(normalizedMetodoPago).toLowerCase();
    if (lowerMetodo.includes('puerta') || lowerMetodo.includes('efectivo')) {
      normalizedMetodoPago = 'pago_puerta';
    } else if (lowerMetodo.includes('qr')) {
      normalizedMetodoPago = 'qr';
    } else if (lowerMetodo.includes('mercadopago')) {
      normalizedMetodoPago = 'mercadopago';
    }

    // Generar código QR de reserva para la orden
    const codigoQR = `TICKET-${numeroOrden}-${targetEventId.toString().slice(-4)}`;

    // Instrucciones y condiciones si es Pago en Puerta
    let instruccionesReserva = null;
    if (normalizedMetodoPago === 'pago_puerta') {
      instruccionesReserva = 'Reserva confirmada. Presentá este ticket digital con su código QR en la entrada del evento para abonar en efectivo en puerta y validar tu ingreso.';
      
      // Descontar el stock para asegurar la reserva en puerta
      await Event.findByIdAndUpdate(targetEventId, {
        $inc: { stock: -cantidad }
      });
    }

    // 3. Crear y guardar la orden 
    const order = await Order.create({
      userId: req.user._id,
      eventId: targetEventId,
      cantidad,
      datosComprador: comprador,
      subtotal: subtotalCalculado,
      total: totalCalculado,
      numeroOrden,
      metodoPago: normalizedMetodoPago,
      estadoPago: 'PENDIENTE',
      codigoQR,
      instruccionesReserva
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ mensaje: 'Error al crear la orden', detalle: error.message || error.toString() });
  }
};

module.exports = { getMyOrders, getOrderById, createOrder };