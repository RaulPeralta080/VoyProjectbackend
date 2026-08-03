const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

const eventosDePrueba = [
  // ─── FLYERS REALES ────────────────────────────────────────────────────────
  {
    nombre: "New Direction Show",
    imagen: "/flyer-danny-proyectil.png",
    generos: ["Post-Punk", "Grunge", "Alternativo"],
    fecha: new Date("2026-09-12"),
    hora: "22:00",
    lugar: "Oskar, Virgen de la Merced 611",
    descripcion: "Danny Proyectil presenta New Direction Show en Oskar junto a Entre Penumbras, Lacrifagia y Para Salir de la Oscuridad. Post-punk, grunge y rock independiente de todo Tucumán.",
    precio: 3500,
    artistas: [
      { nombre: "Danny Proyectil", headliner: true },
      { nombre: "Entre Penumbras" },
      { nombre: "Lacrifagia" },
      { nombre: "Para Salir de la Oscuridad" },
    ],
    capacidadTotal: 80,
    stock: 80,
  },
  {
    nombre: "Los Días No Vividos",
    imagen: "/flyer-las-cosas-inexplicables.png",
    generos: ["Post-Hardcore", "Emo", "Screamo"],
    fecha: new Date("2026-09-13"),
    hora: "21:00",
    lugar: "Utopía House, Bernabé Aráoz 189",
    descripcion: "Debut oficial de Lacrifagia presentando Los Días No Vividos en Utopía House junto a Para Salir de la Oscuridad. Post-hardcore, emo y screamo en el centro de Tucumán.",
    precio: 2500,
    artistas: [
      { nombre: "Lacrifagia", headliner: true },
      { nombre: "Para Salir de la Oscuridad" },
    ],
    capacidadTotal: 70,
    stock: 70,
  },
  {
    nombre: "Sabbath Fest, Edición Tucumán",
    imagen: "/flyer-sabbath-fest.png",
    generos: ["Metal", "Stoner", "Doom", "Heavy Rock"],
    fecha: new Date("2026-11-07"),
    hora: "21:00",
    lugar: "Casa Barrio, 9 de Julio 1032",
    descripcion: "Primera edición del Sabbath Fest en Casa Barrio. Tres horas de riffs pesados, luces bajas y headbanging en el centro. Las Maldiciones abren, Danny Proyectil en el medio y Lacrifagia cierra. No hay manera de que esto salga mal.",
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
    nombre: "Para Salir de la Oscuridad, Lacrifagia",
    imagen: "/flyer-lacrifagia.png",
    generos: ["Post-Hardcore", "Emo", "Screamo"],
    fecha: new Date("2026-10-17"),
    hora: "21:00",
    lugar: "Utopía Bar, Laprida 330",
    descripcion: "Lacrifagia presenta Para Salir de la Oscuridad en Utopía. Show íntimo, entradas contadas. El material nuevo es denso y honesto. Si ya los viste, sabés lo que viene. Si no los viste, este es el momento.",
    precio: 5000,
    artistas: [
      { nombre: "Lacrifagia", headliner: true },
    ],
    capacidadTotal: 50,
    stock: 45,
  },
  // ─── FESTIVAL GRATUITO ────────────────────────────────────────────────────
  {
    nombre: "Festival MAP, Edición Verano",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk"],
    fecha: new Date("2026-12-05"),
    hora: "17:00",
    lugar: "Casa de la Cultura de Tucumán, 25 de Mayo 73",
    descripcion: "El MAP cierra el año en la Casa de la Cultura con grilla libre y gratuita. Cinco bandas locales que mezclan indie, rock y folk. Feria de fanzines en la entrada, dibujo en vivo y foodtrucks afuera. Llevá la silla o hacé pogo, hay lugar para todo.",
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
    nombre: "Noche Under, La Gesta Cultural",
    imagen: "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Shoegaze"],
    fecha: new Date("2026-09-26"),
    hora: "21:30",
    lugar: "La Gesta Cultural, Congreso 177",
    descripcion: "Ciclo under en La Gesta. Tres bandas de indie y shoegaze en el espacio más chico y más lindo del centro. Pez Espada abre, Terrón en el medio y cierra Costas. Mesa de mezcla arriba, gente abajo, todo junto.",
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
    nombre: "Sábado Punk, Bar El Garito",
    imagen: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
    generos: ["Punk", "Hardcore"],
    fecha: new Date("2026-10-10"),
    hora: "22:00",
    lugar: "El Garito, Mendoza 985",
    descripcion: "El Garito enciende el sábado. Punk y hardcore con La Mugre abriendo, Palco Roto en el medio y Código Rojo cerrando. Pocas entradas porque el local tiene capacidad para nada. Si querés ir, anotate ahora.",
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
    nombre: "Ciclo Cultura Oqlta, Patio Reconvertido",
    imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Alternativo"],
    fecha: new Date("2026-11-21"),
    hora: "20:00",
    lugar: "La Casona del Centro, San Martín 850",
    descripcion: "Cultura Oqlta convierte la Casona en escenario. Cuatro bandas que no paran de trabajar. Siesta de Agosto y Viernes de Patio en los primeros turnos, Corte Transversal calentando y Maleza cerrando la noche como sabe. Entrada anticipada más barata en el link.",
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
    nombre: "Finde de Bandas, El Piletón",
    imagen: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    generos: ["Rock", "Grunge"],
    fecha: new Date("2026-12-12"),
    hora: "21:00",
    lugar: "El Piletón, Rondeau 478",
    descripcion: "El Piletón cierra el año con un finde de rock y grunge. Tierra Cruda abre la noche y Ruido Sagrado se lleva todo puesto. Capaz sea el último show de Ruido Sagrado por un buen rato, así que no te lo pierdas.",
    precio: 1500,
    artistas: [
      { nombre: "Tierra Cruda" },
      { nombre: "Ruido Sagrado", headliner: true },
    ],
    capacidadTotal: 50,
    stock: 50,
  },
  {
    nombre: "Festival Emergente Tucumán",
    imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk", "Alternativo"],
    fecha: new Date("2026-12-19"),
    hora: "16:00",
    lugar: "Casa de la Cultura de Tucumán, 25 de Mayo 73",
    descripcion: "El festival más grande de música indie de Tucumán cierra el año con todo. Dos escenarios, cinco bandas, feria de fanzines y artistas plásticos en vivo. Las Ligas Menores, Viento de Norte, Los Tripulantes y Costas abren el camino. Mango de Hacha cierra. Entrada libre y gratuita.",
    precio: 0,
    artistas: [
      { nombre: "Las Ligas Menores" },
      { nombre: "Viento de Norte" },
      { nombre: "Los Tripulantes" },
      { nombre: "Costas" },
      { nombre: "Mango de Hacha", headliner: true },
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
    role: 'client',
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
    role: 'client',
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
    role: 'producer',
    isVerifiedProducer: true,
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
    
    const seededUsers = await User.create(usuariosDePrueba);
    const oskarProducer = seededUsers.find(u => u.username === 'produccionesoskar') || seededUsers[0];
    
    const eventosConCreador = eventosDePrueba.map(evento => ({
      ...evento,
      creador: oskarProducer._id
    }));
    
    const seededEvents = await Event.insertMany(eventosConCreador);

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