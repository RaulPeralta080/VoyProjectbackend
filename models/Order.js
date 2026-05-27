const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es obligatorio'],
    index: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'El ID del evento es obligatorio']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad mínima es 1']
  },
  datosComprador: {
    nombre:   { type: String, required: true },
    apellido: { type: String, required: true },
    email:    { type: String, required: true },
    dni:      { type: String, required: true }
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  numeroOrden: {
    type: String,
    required: true,
    unique: true
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'CONFIRMADA'],
    default: 'CONFIRMADA'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);