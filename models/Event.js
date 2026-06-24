const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  imagen:   { type: String, default: '' },
  generos:  [{ type: String }],
  fecha:    { type: Date, required: true, index: true },
  hora:     { type: String, required: true },
  lugar:    { type: String, required: true },
  precio:   { type: Number, default: 0 },
  descripcion: { type: String, default: '' },
  artistas: [{ nombre: { type: String, required: true }, headliner: { type: Boolean, default: false } }],
  stock:          { type: Number, default: 0 },
  capacidadTotal: { type: Number, default: 1 },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },  // necesario para que 'estado' llegue al frontend
  toObject: { virtuals: true }
});

// Índice para consultas geoespaciales (GeoJSON)
eventSchema.index({ location: '2dsphere' });

// Virtual: calcula el estado de disponibilidad sin guardarlo en la DB
eventSchema.virtual('estado').get(function() {
  if (this.stock === 0) return 'AGOTADO';
  const pct = (this.stock / this.capacidadTotal) * 100;
  return pct <= 20 ? 'ÚLTIMAS ENTRADAS' : 'DISPONIBLE';
});

module.exports = mongoose.model('Event', eventSchema);