const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  imagen:   { type: String, default: '' },              // vacío por defecto, no dependemos de terceros
  generos:  [{ type: String }],
  fecha:    { type: Date, required: true, index: true }, // índice para ordenar por fecha eficientemente
  hora:     { type: String, required: true },
  lugar:    { type: String, required: true },
  precio:   { type: Number, default: 0 },
  artistas: [{ nombre: { type: String, required: true } }],
  stock:          { type: Number, default: 0 },
  capacidadTotal: { type: Number, default: 1 }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },  // necesario para que 'estado' llegue al frontend
  toObject: { virtuals: true }
});

// Virtual: calcula el estado de disponibilidad sin guardarlo en la DB
eventSchema.virtual('estado').get(function() {
  if (this.stock === 0) return 'AGOTADO';
  const pct = (this.stock / this.capacidadTotal) * 100;
  return pct <= 20 ? 'ÚLTIMAS ENTRADAS' : 'DISPONIBLE';
});

module.exports = mongoose.model('Event', eventSchema);