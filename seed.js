const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

const usuariosDePrueba = [
  {
    nombre: 'Juan Perez',
    email: 'juan@test.com',
    password: 'password123',
    username: 'juanperez',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio: 'Melómano y seguidor de la escena under de Tucumán.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'usuario',
    role: 'client',
    redesSociales: { instagram: '@juanperez', web: 'https://juan.dev' },
    avatarColor: '#FF5733',
    bannerGradiente: 'g1',
    vibeEnShows: ['Tranqui', 'Pogo']
  },
  {
    nombre: 'Producciones Oskar',
    email: 'oskar@test.com',
    password: 'password123',
    username: 'produccionesoskar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Organizador de eventos underground y ciclos culturales.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'productor',
    role: 'producer',
    isVerifiedProducer: true,
    redesSociales: { instagram: '@oskar_producciones', web: 'https://oskar.club' },
    avatarColor: '#3357FF',
    bannerGradiente: 'dark',
    vibeEnShows: ['Organizado', 'Profesional']
  },
  // ARTISTAS REGISTRADOS CON SUS LEMAS
  {
    nombre: 'Danny Proyectil',
    email: 'danny@test.com',
    password: 'password123',
    username: 'danny_proyectil',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-danny-proyectil.png',
    bio: 'Post-punk y grunge tucumano. Riffs oscuros, bajos pulsantes y la actitud del New Direction.',
    ubicacion: 'Yerba Buena',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@danny_proyectil' },
    avatarColor: '#33FF57',
    bannerGradiente: 'g3'
  },
  {
    nombre: 'Lacrifagia',
    email: 'lacrifagia@test.com',
    password: 'password123',
    username: 'lacrifagia.banda',
    avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-lacrifagia.png',
    bio: 'Hardcore, emo y rock alternativo tucumano. Expresando catarsis, enojo y verdad en cada fecha.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@lacrifagia.banda' },
    avatarColor: '#FF2D78',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'Bogardus',
    email: 'bogardus@test.com',
    password: 'password123',
    username: 'bogardus.ok',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80',
    bio: 'Rock crudo, surf punk y psicodelia tucumana. Dos décadas haciendo arder los escenarios del under.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@bogardus.ok' },
    avatarColor: '#00FF9F',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'Mientras el Lobo',
    email: 'mientraselobo@test.com',
    password: 'password123',
    username: 'mientraselobo',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    bio: 'Hermandad, canciones directas y rock alternativo de pura cepa tucumana.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@mientraselobo' },
    avatarColor: '#FFD600',
    bannerGradiente: 'g1'
  },
  {
    nombre: 'Utópico Amanecer',
    email: 'utopico@test.com',
    password: 'password123',
    username: 'utopico.amanecer',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dream rock y synth pop alternativo. Oscilando entre la nostalgia, la euforia y las texturas envolventes.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@utopico.amanecer' },
    avatarColor: '#00E5FF',
    bannerGradiente: 'g5'
  },
  {
    nombre: 'Las Maldiciones',
    email: 'lasmaldiciones@test.com',
    password: 'password123',
    username: 'las.maldiciones',
    avatar: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-sabbath-fest.png',
    bio: 'Stoner rock, doom y metal oscuro del centro tucumano. Riffs lentos y pesados que retumban en el suelo.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@las.maldiciones' },
    avatarColor: '#A044FF',
    bannerGradiente: 'dark'
  },
  {
    nombre: 'Plutonio Jam',
    email: 'plutoniojam@test.com',
    password: 'password123',
    username: 'plutoniojam',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    bio: 'Reggae, ska y fusión rítmica tucumana. Buenas vibras y vientos al frente para hacer bailar al under.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@plutoniojam' },
    avatarColor: '#00FF9F',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'black midi',
    email: 'blackmidi@test.com',
    password: 'password123',
    username: 'bmblackmidi',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    bio: 'black midi easter egg',
    ubicacion: 'Londres, Reino Unido 🇬🇧',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@bmblackmidi' },
    avatarColor: '#FF2D78',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'La Mugre',
    email: 'lamugre@test.com',
    password: 'password123',
    username: 'lamugre',
    avatar: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie del barrio. Letras de caño y de tarde en el centro.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@lamugre' },
    avatarColor: '#FFD600',
    bannerGradiente: 'g1'
  },
  {
    nombre: 'Palco Roto',
    email: 'palcoroto@test.com',
    password: 'password123',
    username: 'palcoroto',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    bio: 'Shoegaze tucumano. Suenan como si el calor se volviera ruido.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@palcoroto' },
    avatarColor: '#00E5FF',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'Siesta de Agosto',
    email: 'siestadeagosto@test.com',
    password: 'password123',
    username: 'siestadeagosto',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie folk y melodías íntimas de la siesta tucumana.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@siestadeagosto' },
    avatarColor: '#A044FF',
    bannerGradiente: 'g3'
  },
  {
    nombre: 'Maleza',
    email: 'maleza@test.com',
    password: 'password123',
    username: 'maleza',
    avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie rock del NOA. Riffs frescos, juventud y espíritu festivalero.',
    ubicacion: 'Yerba Buena',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@maleza' },
    avatarColor: '#00FF9F',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'Costas',
    email: 'costas@test.com',
    password: 'password123',
    username: 'costas',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    bio: 'Shoegaze e indie en los escenarios más chicos y más lindos del under.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@costas' },
    avatarColor: '#FF2D78',
    bannerGradiente: 'g5'
  }
];

const eventosDePruebaSinUsuarios = [
  // ─── FLYERS REALES CON ARTISTAS DE TUCUMÁN Y EASTER EGG ───────────────────
  {
    nombre: "New Direction Show",
    imagen: "/flyer-danny-proyectil.png",
    generos: ["Post-Punk", "Grunge", "Alternativo"],
    fecha: new Date("2026-09-12"),
    hora: "22:00",
    lugar: "Oskar, Virgen de la Merced 611",
    descripcion: "Danny Proyectil presenta New Direction Show en Oskar junto a Bogardus, Lacrifagia y Utópico Amanecer. Post-punk, grunge y rock independiente de todo Tucumán.",
    precio: 3500,
    artistasBandas: [
      { nombre: "Bogardus", username: "bogardus.ok" },
      { nombre: "Utópico Amanecer", username: "utopico.amanecer" },
      { nombre: "Lacrifagia", username: "lacrifagia.banda" },
      { nombre: "Danny Proyectil", username: "danny_proyectil", headliner: true },
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
    descripcion: "Debut oficial de Lacrifagia presentando Los Días No Vividos en Utopía House junto a Mientras el Lobo y Plutonio Jam. Hardcore, emo y energía catártica.",
    precio: 2500,
    artistasBandas: [
      { nombre: "Plutonio Jam", username: "plutoniojam" },
      { nombre: "Mientras el Lobo", username: "mientraselobo" },
      { nombre: "Lacrifagia", username: "lacrifagia.banda", headliner: true },
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
    descripcion: "Primera edición del Sabbath Fest en Casa Barrio. Riffs pesados, luces bajas y distorsión. Las Maldiciones, Danny Proyectil y Lacrifagia. Cierra con el Easter Egg de black midi.",
    precio: 5000,
    artistasBandas: [
      { nombre: "Danny Proyectil", username: "danny_proyectil" },
      { nombre: "Las Maldiciones", username: "las.maldiciones" },
      { nombre: "Lacrifagia", username: "lacrifagia.banda", headliner: true },
      { nombre: "black midi", username: "bmblackmidi" },
    ],
    capacidadTotal: 150,
    stock: 150,
  },
  {
    nombre: "Noche Under, La Gesta Cultural",
    imagen: "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Shoegaze"],
    fecha: new Date("2026-09-26"),
    hora: "21:30",
    lugar: "La Gesta Cultural, Congreso 177",
    descripcion: "Ciclo under en La Gesta. Tres bandas de indie y shoegaze en el espacio más lindo del centro. La Mugre, Palco Roto y Costas.",
    precio: 1500,
    artistasBandas: [
      { nombre: "La Mugre", username: "lamugre" },
      { nombre: "Palco Roto", username: "palcoroto" },
      { nombre: "Costas", username: "costas", headliner: true },
    ],
    capacidadTotal: 60,
    stock: 45,
  },
  {
    nombre: "Festival MAP, Edición Verano",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk"],
    fecha: new Date("2026-12-05"),
    hora: "17:00",
    lugar: "Casa de la Cultura de Tucumán, 25 de Mayo 73",
    descripcion: "El MAP cierra el año en la Casa de la Cultura con grilla libre y gratuita. Maleza, Siesta de Agosto y Utópico Amanecer.",
    precio: 0,
    artistasBandas: [
      { nombre: "Maleza", username: "maleza" },
      { nombre: "Utópico Amanecer", username: "utopico.amanecer" },
      { nombre: "Siesta de Agosto", username: "siestadeagosto", headliner: true },
    ],
    capacidadTotal: 300,
    stock: 300,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await User.deleteMany({});
    
    const seededUsers = await User.create(usuariosDePrueba);
    const oskarProducer = seededUsers.find(u => u.username === 'produccionesoskar') || seededUsers[0];
    
    const userMapByUsername = {};
    seededUsers.forEach(u => {
      userMapByUsername[u.username] = u._id;
    });

    const eventosConCreador = eventosDePruebaSinUsuarios.map(evento => {
      const artistasConUsuario = (evento.artistasBandas || []).map(a => ({
        nombre: a.nombre,
        headliner: a.headliner || false,
        usuario: userMapByUsername[a.username] || null
      }));

      return {
        ...evento,
        artistas: artistasConUsuario,
        creador: oskarProducer._id
      };
    });
    
    const seededEvents = await Event.insertMany(eventosConCreador);

    seededUsers[0].siguiendo.push(seededUsers[2]._id);
    seededUsers[2].seguidores.push(seededUsers[0]._id);
    seededUsers[0].favoritos.push(seededEvents[0]._id);

    await seededUsers[0].save();
    await seededUsers[2].save();

    console.log(`✓ ${seededEvents.length} eventos under cargados con éxito`);
    console.log(`✓ ${seededUsers.length} usuarios con perfiles completos cargados con éxito`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();