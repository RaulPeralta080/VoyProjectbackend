const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const eventosDePrueba = [
  {
    nombre: "Festival de Rock Tucumano",
    imagen: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
    generos: ["Rock", "Alternativo"],
    fecha: new Date("2026-05-20"),
    hora: "21:00",
    lugar: "Club Tucumán BB",
    precio: 5000,
    artistas: [{ nombre: "Banda A" }, { nombre: "Banda B" }],
    stock: 50,
    estado: "DISPONIBLE"
  },
  {
    nombre: "Toque Punk Under",
    imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    generos: ["Punk", "Hardcore"],
    fecha: new Date("2026-04-30"),
    hora: "23:30",
    lugar: "Mithos Bar",
    precio: 3000,
    artistas: [{ nombre: "Los Ramones Tucumanos" }, { nombre: "Distorsión" }],
    stock: 100,
    estado: "DISPONIBLE"
  },
  {
    nombre: "Noche de Grunge Alternativo",
    imagen: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=400&q=80",
    generos: ["Grunge", "Rock"],
    fecha: new Date("2026-06-15"),
    hora: "22:00",
    lugar: "El Piletón",
    precio: 4000,
    artistas: [{ nombre: "Nirvana Cover Band" }],
    stock: 10,
    estado: "ÚLTIMAS ENTRADAS"
  },
  {
    nombre: "Encuentro de Metal Extremo",
    imagen: "https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&w=400&q=80",
    generos: ["Metal"],
    fecha: new Date("2026-07-10"),
    hora: "20:00",
    lugar: "Club Estudiantes",
    precio: 6000,
    artistas: [{ nombre: "Sangre Acero" }, { nombre: "Muerte Subita" }, { nombre: "Calavera" }],
    stock: 0,
    estado: "AGOTADO"
  },
  {
    nombre: "Ciclo de Pop Indie",
    imagen: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    generos: ["Pop", "Indie"],
    fecha: new Date("2026-08-05"),
    hora: "19:00",
    lugar: "Casa de la Cultura",
    precio: 2500,
    artistas: [{ nombre: "Luz y Sombras" }],
    stock: 200,
    estado: "DISPONIBLE"
  },
  {
    nombre: "Tributo al Rock Nacional",
    imagen: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
    generos: ["Rock", "Alter Rock"],
    fecha: new Date("2026-09-12"),
    hora: "21:30",
    lugar: "Teatro Alberdi",
    precio: 8000,
    artistas: [{ nombre: "Cerati Experience" }],
    stock: 30,
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