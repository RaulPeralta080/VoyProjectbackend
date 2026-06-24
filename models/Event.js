const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  imagen:   { type: String, default: '' },
  generos:  [{ type: String }],
  fecha:    { type: Date, required: true, index: true },
  hora:     { type: String, required: true },
  lugar:    { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitud, Latitud]
      default: [0, 0]
    }
  },
  precio:   { type: Number, default: 0 },
  descripcion: { type: String, default: '' },
  informacionAdicional: { type: String, default: '' },
  artistas: [{ nombre: { type: String, required: true }, headliner: { type: Boolean, default: false } }],
  stock:          { type: Number, default: 0 },
  capacidadTotal: { type: Number, default: 1 },
  destacado: { type: Boolean, default: false },
  estadoPublicacion: { 
    type: String, 
    enum: ['ACTIVO', 'PAUSADO', 'CANCELADO'], 
    default: 'ACTIVO' 
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },  // necesario para que 'estado' llegue al frontend
  toObject: { virtuals: true }
});

// Índice geoespacial para búsquedas
eventSchema.index({ location: '2dsphere' });

// Virtual: calcula el estado de disponibilidad
eventSchema.virtual('estado').get(function() {
  if (this.estadoPublicacion === 'PAUSADO') return 'PAUSADO';
  if (this.estadoPublicacion === 'CANCELADO') return 'CANCELADO';
  
  if (this.stock === 0) return 'AGOTADO';
  const pct = (this.stock / this.capacidadTotal) * 100;
  return pct <= 20 ? 'ÚLTIMAS ENTRADAS' : 'DISPONIBLE';
});

module.exports = mongoose.model('Event', eventSchema);