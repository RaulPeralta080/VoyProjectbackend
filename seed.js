const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

const eventosDePrueba = [
  // ─── FLYERS REALES ────────────────────────────────────────────────────────
  {
    nombre: "New Direction — Danny Proyectil",
    imagen: "/flyer-danny-proyectil.png",
    generos: ["Post-Punk", "New Wave", "Alternativo"],
    fecha: new Date("2026-01-30"),
    hora: "22:00",
    lugar: "Oskar — Virgen de la Merced 611",
    descripcion: "Danny Proyectil presenta New Direction, su nuevo EP de post-punk y new wave grabado en vivo. Una noche de energía cruda y sonido sin filtros.",
    precio: 3500,
    artistas: [
      { nombre: "Danny Proyectil", headliner: true },
      { nombre: "Por Somos Humanos" },
    ],
    capacidadTotal: 80,
    stock: 80,
  },
  {
    nombre: "Debut — Las Cosas Inexplicables",
    imagen: "/flyer-las-cosas-inexplicables.png",
    generos: ["Noise Rock", "Alternativo", "Indie"],
    fecha: new Date("2025-09-13"),
    hora: "22:00",
    lugar: "Oskar — Virgen de la Merced 611",
    descripcion: "La noche de debut de Las Cosas Inexplicables junto a Lacrifagia. Dos bandas que llevan el under de Tucumán a su máxima expresión.",
    precio: 2500,
    artistas: [
      { nombre: "Las Cosas Inexplicables", headliner: true },
      { nombre: "Lacrifagia" },
    ],
    capacidadTotal: 70,
    stock: 70,
  },
  {
    nombre: "Sabbath Fest — Edición Tucumán",
    imagen: "/flyer-sabbath-fest.png",
    generos: ["Metal", "Stoner", "Doom", "Heavy Rock"],
    fecha: new Date("2025-12-13"),
    hora: "21:00",
    lugar: "Casa Barrio — 9 de Julio 1032",
    descripcion: "La primera edición del Sabbath Fest en Tucumán. Tres horas de riffs pesados, luces bajas y headbanging colectivo. No apto para oídos sensibles.",
    precio: 5000,
    artistas: [
      { nombre: "Las Maldiciones" },
      { nombre: "Danny Proyectil" },
      { nombre: "Lacrifagia", headliner: true },
    ],
    capacidadTotal: 150,
    stock: 150,
  },
  {
    nombre: "Para Salir de la Oscuridad — Lacrifagia",
    imagen: "/flyer-lacrifagia.png",
    generos: ["Post-Hardcore", "Emo", "Screamo"],
    fecha: new Date("2026-05-08"),
    hora: "21:00",
    lugar: "Bar Floresta — Av. Colón 471",
    descripcion: "Lacrifagia presenta Para Salir de la Oscuridad, su nuevo material. Una noche íntima en el Bar Floresta con entradas limitadas.",
    precio: 5000,
    artistas: [
      { nombre: "Lacrifagia", headliner: true },
    ],
    capacidadTotal: 50,
    stock: 45,
  },
  // ─── FESTIVAL GRATUITO ────────────────────────────────────────────────────
  {
    nombre: "Festival MAP — Edición Invierno",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk"],
    fecha: new Date("2026-07-09"),
    hora: "17:00",
    lugar: "Casa de la Cultura de Tucumán",
    descripcion: "El festival MAP vuelve al invierno con una grilla de bandas locales que mezclan indie, rock y folk en el corazón de la ciudad.",
    precio: 0,
    artistas: [
      { nombre: "Maleza" },
      { nombre: "Estela de Mar" },
      { nombre: "Los del Patio" },
      { nombre: "Curda" },
      { nombre: "Siesta de Agosto", headliner: true },
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
    descripcion: "Un ciclo de música underground en La Gesta Cultural. Tres bandas de indie y shoegaze en un espacio íntimo y cultural.",
    precio: 1500,
    artistas: [
      { nombre: "Pez Espada" },
      { nombre: "Terrón" },
      { nombre: "Costas", headliner: true },
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
    descripcion: "El Garito enciende el sábado con una noche de punk y hardcore que va a dejar el lugar patas para arriba.",
    precio: 1000,
    artistas: [
      { nombre: "La Mugre" },
      { nombre: "Palco Roto" },
      { nombre: "Código Rojo", headliner: true },
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
    descripcion: "Ciclo Cultura Oqlta, la serie de eventos que transforma espacios en escenarios. Esta vez, el Patio Reconvertido es el protagonista.",
    precio: 2000,
    artistas: [
      { nombre: "Siesta de Agosto" },
      { nombre: "Viernes de Patio" },
      { nombre: "Corte Transversal" },
      { nombre: "Maleza", headliner: true },
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
    descripcion: "El Piletón trae un finde de bandas de rock y grunge con todo el volumen y la energía del underground tucumano.",
    precio: 1500,
    artistas: [
      { nombre: "Tierra Cruda" },
      { nombre: "Ruido Sagrado", headliner: true },
    ],
    capacidadTotal: 50,
    stock: 0,
  },
  {
    nombre: "Festival Emergente NOA",
    imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk", "Alternativo"],
    fecha: new Date("2026-08-15"),
    hora: "16:00",
    lugar: "Casa de la Cultura de Tucumán",
    descripcion: "El festival más grande de música indie del NOA. Dos escenarios simultáneos, feria de fanzines, artistas plásticos en vivo y foodtrucks.",
    precio: 0,
    artistas: [
      { nombre: "Las Ligas Menores" },
      { nombre: "Viento de Norte" },
      { nombre: "Los Tripulantes" },
      { nombre: "Mango de Hacha", headliner: true },
      { nombre: "Costas" },
    ],
    capacidadTotal: 250,
    stock: 250,
  },
];

const usuariosDePrueba = [
  {
    nombre: 'Juan Perez',
    email: 'juan@test.com',
    password: 'password123',
    username: 'juanperez',
    avatar: '/avatars/juan.png',
    bio: 'Melómano y seguidor de la escena under de Tucumán.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'usuario',
    redesSociales: {
      instagram: '@juanperez',
      web: 'https://juan.dev'
    },
    avatarColor: '#FF5733',
    bannerGradiente: 'sunset',
    vibeEnShows: ['Tranqui', 'Pogo']
  },
  {
    nombre: 'Danny Proyectil',
    email: 'danny@test.com',
    password: 'password123',
    username: 'dannyproyectil',
    avatar: '/avatars/danny.png',
    bio: 'Post-punk de Tucumán. Presentando New Direction.',
    ubicacion: 'Yerba Buena',
    rol: 'artista',
    redesSociales: {
      instagram: '@dannyproyectil',
      spotify: 'spotify:artist:danny',
      youtube: 'https://youtube.com/danny'
    },
    avatarColor: '#33FF57',
    bannerGradiente: 'neon',
    vibeEnShows: ['Intenso', 'Oscuro']
  },
  {
    nombre: 'Producciones Oskar',
    email: 'oskar@test.com',
    password: 'password123',
    username: 'produccionesoskar',
    avatar: '/avatars/oskar.png',
    bio: 'Organizador de eventos underground y ciclos culturales.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'productor',
    redesSociales: {
      instagram: '@oskar_producciones',
      web: 'https://oskar.club'
    },
    avatarColor: '#3357FF',
    bannerGradiente: 'dark',
    vibeEnShows: ['Organizado', 'Profesional']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await User.deleteMany({});
    
    const seededEvents = await Event.insertMany(eventosDePrueba);
    const seededUsers = await User.create(usuariosDePrueba);

    seededUsers[0].siguiendo.push(seededUsers[1]._id);
    seededUsers[1].seguidores.push(seededUsers[0]._id);
    seededUsers[0].favoritos.push(seededEvents[0]._id);
    seededUsers[0].favoritos.push(seededUsers[1]._id);

    await seededUsers[0].save();
    await seededUsers[1].save();

    console.log(`✓ ${seededEvents.length} eventos under cargados con éxito`);
    console.log(`✓ ${seededUsers.length} usuarios con perfiles completos cargados con éxito`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();