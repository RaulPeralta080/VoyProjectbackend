const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Antes era 'title'
  imagen: { type: String, required: true }, // Antes era 'imageUrl'
  generos: [{ type: String }],              // Array de géneros
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },   // Podés guardarlo como "21:00"
  lugar: { type: String, required: true },
  precio: { type: Number, required: true },
  artistas: [{ type: String }],             // Array de nombres
  stock: { type: Number, default: 0 },      // Lo vamos a necesitar para el 'estado'
  // El 'estado' lo calcularemos dinámicamente o lo guardamos
  estado: { 
    type: String, 
    enum: ['DISPONIBLE', 'ÚLTIMAS ENTRADAS', 'AGOTADO'], 
    default: 'DISPONIBLE' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);