const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const eventosDePrueba = [
  {
    nombre: "Festival de Rock Tucumano",
    imagen: "https://via.placeholder.com/400",
    generos: ["Rock", "Alternativo"],
    fecha: new Date("2026-05-20"),
    hora: "21:00",
    lugar: "Club Tucumán BB",
    precio: 5000,
    artistas: ["Banda A", "Banda B"],
    stock: 50,
    estado: "DISPONIBLE"
  },
  {
    nombre: "Feria Gastronómica",
    imagen: "https://via.placeholder.com/400",
    generos: ["Culinaria"],
    fecha: new Date("2026-04-30"), // Este debería aparecer primero por ser fecha más cercana
    hora: "12:00",
    lugar: "Parque 9 de Julio",
    precio: 0,
    artistas: ["Chef Local"],
    stock: 100,
    estado: "DISPONIBLE"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({}); // Limpia lo que haya
    await Event.insertMany(eventosDePrueba);
    console.log("¡Datos de prueba cargados con éxito!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();