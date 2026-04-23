const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  imagen: { type: String, default: 'https://via.placeholder.com/400' }, // Imagen por defecto si falta
  generos: [{ type: String }],
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  lugar: { type: String, required: true },
  precio: { type: Number, default: 0 },
  artistas: [{ 
    nombre: { type: String, required: true } 
  }],
  // Campos necesarios para el cálculo de estado
  stock: { type: Number, default: 0 },
  capacidadTotal: { type: Number, default: 1 } 
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, // Importante para que el estado se envíe al frontend
  toObject: { virtuals: true }
});

// Lógica de negocio para el campo "estado"
eventSchema.virtual('estado').get(function() {
  if (this.stock === 0) return 'AGOTADO';
  
  const porcentajeDisponible = (this.stock / this.capacidadTotal) * 100;
  
  if (porcentajeDisponible <= 20) {
    return 'ÚLTIMAS ENTRADAS';
  }
  
  return 'DISPONIBLE';
});

module.exports = mongoose.model('Event', eventSchema);