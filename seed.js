const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const eventosDePrueba = [
  // ─── FESTIVAL GRATUITO ────────────────────────────────────────────────────
  {
    nombre: "Festival MAP — Edición Invierno",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk"],
    fecha: new Date("2026-07-09"), // feriado nacional
    hora: "17:00",
    lugar: "Casa de la Cultura de Tucumán",
    precio: 0,
    artistas: [
      { nombre: "Maleza" },
      { nombre: "Estela de Mar" },
      { nombre: "Los del Patio" },
      { nombre: "Curda" },
      { nombre: "Siesta de Agosto" }
    ],
    capacidadTotal: 300,
    stock: 300,
  },
  // ─── CICLO UNDER EN BARES ─────────────────────────────────────────────────
  {
    nombre: "Noche Under — La Gesta Cultural",
    imagen: "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Shoegaze"],
    fecha: new Date("2026-06-07"),
    hora: "21:30",
    lugar: "La Gesta Cultural",
    precio: 1500,
    artistas: [
      { nombre: "Pez Espada" },
      { nombre: "Terrón" },
      { nombre: "Costas" }
    ],
    capacidadTotal: 60,
    stock: 45,
  },
  {
    nombre: "Sábado Punk — Bar El Garito",
    imagen: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
    generos: ["Punk", "Hardcore"],
    fecha: new Date("2026-06-14"),
    hora: "22:00",
    lugar: "Bar El Garito",
    precio: 1000,
    artistas: [
      { nombre: "La Mugre" },
      { nombre: "Palco Roto" },
      { nombre: "Código Rojo" }
    ],
    capacidadTotal: 40,
    stock: 8,
  },
  {
    nombre: "Ciclo Cultura Oqlta — Patio Reconvertido",
    imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Alternativo"],
    fecha: new Date("2026-06-21"),
    hora: "20:00",
    lugar: "La Casona del Centro",
    precio: 2000,
    artistas: [
      { nombre: "Siesta de Agosto" },
      { nombre: "Viernes de Patio" },
      { nombre: "Corte Transversal" },
      { nombre: "Maleza" }
    ],
    capacidadTotal: 80,
    stock: 80,
  },
  {
    nombre: "Finde de Bandas — El Piletón",
    imagen: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    generos: ["Rock", "Grunge"],
    fecha: new Date("2026-07-04"),
    hora: "21:00",
    lugar: "El Piletón",
    precio: 1500,
    artistas: [
      { nombre: "Tierra Cruda" },
      { nombre: "Ruido Sagrado" }
    ],
    capacidadTotal: 50,
    stock: 0, // agotado — el clásico sold out de 50 personas
  },
  {
    nombre: "Hardcore en Mithos — Tucumán HC",
    imagen: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    generos: ["Hardcore", "Punk"],
    fecha: new Date("2026-07-18"),
    hora: "22:30",
    lugar: "Mithos Bar",
    precio: 800,
    artistas: [
      { nombre: "Palco Roto" },
      { nombre: "La Mugre" }
    ],
    capacidadTotal: 30,
    stock: 6, // últimas entradas
  },
  // ─── EVENTO FESTIVAL MÁS GRANDE ───────────────────────────────────────────
  {
    nombre: "Festival Emergente NOA",
    imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk", "Alternativo"],
    fecha: new Date("2026-08-15"), // feriado
    hora: "16:00",
    lugar: "Casa de la Cultura de Tucumán",
    precio: 0,
    artistas: [
      { nombre: "Las Ligas Menores" },
      { nombre: "Viento de Norte" },
      { nombre: "Los Tripulantes" },
      { nombre: "Mango de Hacha" },
      { nombre: "Costas" }
    ],
    capacidadTotal: 250,
    stock: 250,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await Event.insertMany(eventosDePrueba);
    console.log(`✓ ${eventosDePrueba.length} eventos under cargados con éxito`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();