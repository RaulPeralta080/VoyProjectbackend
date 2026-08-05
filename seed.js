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
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    lema: 'Melómano impenitente del under tucumano.',
    bio: 'Melómano y seguidor incondicional de la escena under de Tucumán. Recorriendo fechas locales desde 2018.',
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
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    lema: 'Gestionando cultura independiente en el NOA.',
    bio: 'Organizador de eventos underground, fechas alternativas y ciclos culturales independientes en Tucumán.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'productor',
    role: 'producer',
    isVerifiedProducer: true,
    redesSociales: { instagram: '@oskar_producciones', web: 'https://oskar.club' },
    avatarColor: '#3357FF',
    bannerGradiente: 'dark',
    vibeEnShows: ['Organizado', 'Profesional']
  },

  // ─── ARTISTAS CON PERFILES COMPLETOS Y LEMAS INVESTIGADOS ──────────────────
  {
    nombre: 'Lacrifagia',
    email: 'lacrifagia@test.com',
    password: 'password123',
    username: 'lacrifagia.banda',
    avatar: '/lacrifagia-avatar.png',
    avatarUrl: '/lacrifagia-avatar.png',
    fotoPerfil: '/lacrifagia-avatar.png',
    bannerImagen: '/lacrifagia-banner.png',
    lema: 'Cuarteto de emo, post-hardcore y rock alternativo.',
    bio: 'Banda nacida en San Miguel de Tucumán dedicada al post-hardcore, emo y rock alternativo. Expresando catarsis, energía cruda y letras profundas en cada fecha del under tucumano.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@lacrifagia.banda', spotifyTrack: 'https://open.spotify.com/track/3c42zbZ1m4s1R3zsGDgzE7?si=06c445bec2534c0c' },
    avatarColor: 'none',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'Danny Proyectil',
    email: 'danny@test.com',
    password: 'password123',
    username: 'danny_proyectil',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    bannerImagen: '/flyer-danny-proyectil.png',
    lema: 'Post-punk y grunge tucumano con actitud New Direction.',
    bio: 'Trío de post-punk, grunge y rock alternativo de Yerba Buena. Sonido oscuro con bajos pulsantes, distorsiones ruidosas y letras urbanas.',
    ubicacion: 'Yerba Buena',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@danny_proyectil', spotifyTrack: 'https://open.spotify.com/track/1Bxfay2wALPHxfsMVyG1vM' },
    avatarColor: 'none',
    bannerGradiente: 'g3'
  },
  {
    nombre: 'Bogardus',
    email: 'bogardus@test.com',
    password: 'password123',
    username: 'bogardus.ok',
    avatar: '/bogardus-avatar.png',
    avatarUrl: '/bogardus-avatar.png',
    fotoPerfil: '/bogardus-avatar.png',
    bannerImagen: '/bogardus-banner.png',
    lema: 'VIVA EL DIAVLO.',
    bio: 'Icónica banda tucumana de surf punk, grunge y rock psicodélico. Dos décadas encendiendo los escenarios del underground del NOA con distorsión valvular, estética DIY y una potente energía en vivo.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { 
      instagram: '@bogardus.ok', 
      spotifyTrack: 'https://open.spotify.com/track/3PyhGllBciGG2vWC65ilps?si=91738f6859824644' 
    },
    avatarColor: 'none',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'Mientras el Lobo',
    email: 'mientraselobo@test.com',
    password: 'password123',
    username: 'mientraselobo',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    lema: 'Canciones directas, hermandad y rock alternativo de cepa tucumana.',
    bio: 'Banda de rock alternativo tucumana caracterizada por melodías viscerales, lírica introspectiva y guitarras melódicas al frente.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@mientraselobo', spotifyTrack: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp' },
    avatarColor: 'none',
    bannerGradiente: 'g1'
  },
  {
    nombre: 'Utópico Amanecer',
    email: 'utopico@test.com',
    password: 'password123',
    username: 'utopico.amanecer',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    lema: 'Dream rock y synth pop en texturas envolventes.',
    bio: 'Proyecto de dream rock y synth pop alternativo que oscila entre la nostalgia sintetizada, la euforia y climas nocturnos.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@utopico.amanecer', spotifyTrack: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' },
    avatarColor: 'none',
    bannerGradiente: 'g5'
  },
  {
    nombre: 'Las Maldiciones',
    email: 'lasmaldiciones@test.com',
    password: 'password123',
    username: 'las.maldiciones',
    avatar: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80',
    bannerImagen: '/flyer-sabbath-fest.png',
    lema: 'Stoner rock, doom metal y riffs pesados del centro.',
    bio: 'Trío de stoner rock y doom metal oscuro del centro tucumano. Bajos valvulares pesados y tempos lentos que hacen retumbar el suelo.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@las.maldiciones', spotifyTrack: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' },
    avatarColor: 'none',
    bannerGradiente: 'dark'
  },
  {
    nombre: 'Plutonio Jam',
    email: 'plutoniojam@test.com',
    password: 'password123',
    username: 'plutoniojam',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    lema: 'Reggae, ska y fusión rítmica con vientos al frente.',
    bio: 'Colectivo de reggae, ska y música latina tucumana. Ritmos festivos, sección de vientos potente y buenas vibras para bailar.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@plutoniojam', spotifyTrack: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' },
    avatarColor: 'none',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'black midi',
    email: 'blackmidi@test.com',
    password: 'password123',
    username: 'bmblackmidi',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    lema: 'Math rock, post-punk avant-garde y caos instrumental.',
    bio: 'Agrupación de math rock y post-punk experimental reconocida por sus complejas estructuras rítmicas e improvisación técnica salvaje.',
    ubicacion: 'Londres, Reino Unido 🇬🇧',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@bmblackmidi', spotifyTrack: 'https://open.spotify.com/track/3Zhh358vO46xLFFJrm9E0K' },
    avatarColor: 'none',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'La Mugre',
    email: 'lamugre@test.com',
    password: 'password123',
    username: 'lamugre',
    avatar: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=600&q=80',
    lema: 'Indie de barrio y canciones urbanas del centro.',
    bio: 'Banda de indie rock urbano nacida en el centro tucumano. Letras directas, callejeras y ritmo cotidiano del NOA.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@lamugre' },
    avatarColor: 'none',
    bannerGradiente: 'g1'
  },
  {
    nombre: 'Palco Roto',
    email: 'palcoroto@test.com',
    password: 'password123',
    username: 'palcoroto',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    lema: 'Shoegaze tucumano. Ruido, distorsión y paredes de sonido.',
    bio: 'Cuarteto de shoegaze y noise pop tucumano. Paredes de sonido analógico, reverbs densos y vocales etéreas.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@palcoroto' },
    avatarColor: 'none',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'Siesta de Agosto',
    email: 'siestadeagosto@test.com',
    password: 'password123',
    username: 'siestadeagosto',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    lema: 'Indie folk y canciones íntimas de la tarde tucumana.',
    bio: 'Proyecto de indie folk acústico y melodías nostálgicas inspiradas en las tardes calurosas de siesta en el norte.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@siestadeagosto' },
    avatarColor: 'none',
    bannerGradiente: 'g3'
  },
  {
    nombre: 'Maleza',
    email: 'maleza@test.com',
    password: 'password123',
    username: 'maleza',
    avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
    lema: 'Indie rock del NOA. Riffs frescos y espíritu festivalero.',
    bio: 'Banda de indie rock y pop alternativo de Yerba Buena. Melodías luminosas, dinamismo y frescura escénica.',
    ubicacion: 'Yerba Buena',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@maleza' },
    avatarColor: 'none',
    bannerGradiente: 'g4'
  },
  {
    nombre: 'Costas',
    email: 'costas@test.com',
    password: 'password123',
    username: 'costas',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    lema: 'Shoegaze e indie en los rincones más lindos del under.',
    bio: 'Agrupación de shoegaze y dreampop tucumano enfocada en climas envolventes y presentaciones en espacios alternativos.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@costas' },
    avatarColor: 'none',
    bannerGradiente: 'g5'
  },
  {
    nombre: 'Entre Penumbras',
    email: 'entrepenumbras@test.com',
    password: 'password123',
    username: 'entrepenumbras',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80',
    lema: 'Post-punk atmosférico y paisajes sombríos.',
    bio: 'Proyecto de post-punk y shoegaze emergente de San Miguel de Tucumán. Texturas sombrías y atmósferas nocturnas.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@entrepenumbras' },
    avatarColor: 'none',
    bannerGradiente: 'g1'
  },
  {
    nombre: 'Para Salir de la Oscuridad',
    email: 'parasalir@test.com',
    password: 'password123',
    username: 'parasalirdelaoscuridad',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    bannerImagen: '/flyer-lacrifagia.png',
    lema: 'Screamo, emo noventero y catarsis colectiva.',
    bio: 'Banda de screamo y emo violencia tucumana. Canciones urgentes, pasajes armónicos y un directo cargado de emoción cruda.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@parasalirdelaoscuridad' },
    avatarColor: '#FF2D78',
    bannerGradiente: 'g2'
  },
  {
    nombre: 'Las Cosas Inexplicables',
    email: 'lascosas@test.com',
    password: 'password123',
    username: 'lascosasinexplicables',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    fotoPerfil: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    bannerImagen: '/flyer-las-cosas-inexplicables.png',
    lema: 'Math rock e indie instrumental de compases desarmados.',
    bio: 'Cuarteto de math rock e indie progresivo tucumano. Complejidad rítmica, guitarras entrelazadas y climas instrumentales dinámicos.',
    ubicacion: 'San Miguel de Tucumán',
    rol: 'artista',
    role: 'artist',
    redesSociales: { instagram: '@lascosasinexplicables' },
    avatarColor: '#00FF9F',
    bannerGradiente: 'g3'
  }
];

const eventosDePruebaSinUsuarios = [
  // ─── FLYERS REALES CON SUS GRILLAS ORIGINALES RESTAURADAS ──────────────────
  {
    nombre: "New Direction Show",
    imagen: "/flyer-danny-proyectil.png",
    generos: ["Post-Punk", "Grunge", "Alternativo"],
    fecha: new Date("2026-09-12"),
    hora: "22:00",
    lugar: "Oskar, Virgen de la Merced 611",
    descripcion: "Danny Proyectil presenta New Direction Show en Oskar junto a Entre Penumbras, Lacrifagia y Para Salir de la Oscuridad. Post-punk, grunge y rock independiente de todo Tucumán.",
    precio: 3500,
    artistasBandas: [
      { nombre: "Entre Penumbras", username: "entrepenumbras" },
      { nombre: "Lacrifagia", username: "lacrifagia.banda" },
      { nombre: "Para Salir de la Oscuridad", username: "parasalirdelaoscuridad" },
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
    descripcion: "Debut oficial de Lacrifagia presentando Los Días No Vividos en Utopía House junto a Para Salir de la Oscuridad y Las Cosas Inexplicables. Post-hardcore, emo y screamo en el centro de Tucumán.",
    precio: 2500,
    artistasBandas: [
      { nombre: "Para Salir de la Oscuridad", username: "parasalirdelaoscuridad" },
      { nombre: "Las Cosas Inexplicables", username: "lascosasinexplicables" },
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
    descripcion: "Primera edición del Sabbath Fest en Casa Barrio. Tres horas de riffs pesados, luces bajas y headbanging en el centro. Las Maldiciones abren, Danny Proyectil en el medio y Lacrifagia cierra.",
    precio: 5000,
    artistasBandas: [
      { nombre: "Las Maldiciones", username: "las.maldiciones" },
      { nombre: "Danny Proyectil", username: "danny_proyectil" },
      { nombre: "Lacrifagia", username: "lacrifagia.banda", headliner: true },
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
    descripcion: "Lacrifagia presenta Para Salir de la Oscuridad en Utopía. Show íntimo, entradas contadas. El material nuevo es denso y honesto.",
    precio: 5000,
    artistasBandas: [
      { nombre: "Lacrifagia", username: "lacrifagia.banda", headliner: true },
    ],
    capacidadTotal: 50,
    stock: 45,
  },

  // ─── NUEVOS EVENTOS DEDICADOS A LOS NUEVOS ARTISTAS Y EASTER EGG ────────────
  {
    nombre: "Noche Psicodélica en Magic",
    imagen: "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80",
    generos: ["Surf Punk", "Dream Rock", "Psicodelia"],
    fecha: new Date("2026-10-24"),
    hora: "22:30",
    lugar: "Magic Music Box, La Madrid 274",
    descripcion: "Una velada de distorsión, sintetizadores y paisajes sonoros en Magic Music Box. Bogardus encabeza la fecha junto a la magia envolvente de Utópico Amanecer y el rock alternativo de Mientras el Lobo.",
    precio: 3000,
    artistasBandas: [
      { nombre: "Mientras el Lobo", username: "mientraselobo" },
      { nombre: "Utópico Amanecer", username: "utopico.amanecer" },
      { nombre: "Bogardus", username: "bogardus.ok", headliner: true },
    ],
    capacidadTotal: 100,
    stock: 100,
  },
  {
    nombre: "Ritmo Under & Fusión Reggae-Ska",
    imagen: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    generos: ["Reggae", "Ska", "Indie"],
    fecha: new Date("2026-11-14"),
    hora: "21:00",
    lugar: "La Casona del Centro, San Martín 850",
    descripcion: "Noche de baile y buenas vibras en La Casona. Plutonio Jam encabeza una fecha cargada de vientos, ska y reggae fusión junto a La Mugre y Maleza.",
    precio: 2000,
    artistasBandas: [
      { nombre: "La Mugre", username: "lamugre" },
      { nombre: "Maleza", username: "maleza" },
      { nombre: "Plutonio Jam", username: "plutoniojam", headliner: true },
    ],
    capacidadTotal: 120,
    stock: 120,
  },
  {
    nombre: "Avant-Garde Underground Night",
    imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    generos: ["Avant-Garde", "Math Rock", "Post-Punk"],
    fecha: new Date("2026-12-18"),
    hora: "22:00",
    lugar: "Utopía House, Bernabé Aráoz 189",
    descripcion: "Fecha especial e imperdible en Utopía House. El caos progresivo y math rock de black midi como evento especial junto al rock crudo de Bogardus y Danny Proyectil.",
    precio: 6000,
    artistasBandas: [
      { nombre: "Danny Proyectil", username: "danny_proyectil" },
      { nombre: "Bogardus", username: "bogardus.ok" },
      { nombre: "black midi", username: "bmblackmidi", headliner: true },
    ],
    capacidadTotal: 90,
    stock: 90,
  },
  {
    nombre: "Festival MAP, Edición Verano",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    generos: ["Indie", "Rock", "Folk"],
    fecha: new Date("2026-12-05"),
    hora: "17:00",
    lugar: "Casa de la Cultura de Tucumán, 25 de Mayo 73",
    descripcion: "El MAP cierra el año en la Casa de la Cultura con grilla libre y gratuita. Maleza, Siesta de Agosto, Costas y Utópico Amanecer.",
    precio: 0,
    artistasBandas: [
      { nombre: "Maleza", username: "maleza" },
      { nombre: "Costas", username: "costas" },
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
        usuario: a.username ? userMapByUsername[a.username] || null : null
      }));

      return {
        ...evento,
        artistas: artistasConUsuario,
        creador: oskarProducer._id
      };
    });
    
    const seededEvents = await Event.insertMany(eventosConCreador);

    // ─── CONEXIONES SOCIALES DE SEGUIDORES Y SIGUIENDO REALES ──────────────────
    const userMap = {};
    seededUsers.forEach(u => { userMap[u.username] = u; });

    // Juan Perez sigue a Lacrifagia, Bogardus, Danny Proyectil
    if (userMap['juanperez'] && userMap['lacrifagia.banda']) {
      userMap['juanperez'].siguiendo.push(userMap['lacrifagia.banda']._id);
      userMap['lacrifagia.banda'].seguidores.push(userMap['juanperez']._id);
    }
    if (userMap['juanperez'] && userMap['bogardus.ok']) {
      userMap['juanperez'].siguiendo.push(userMap['bogardus.ok']._id);
      userMap['bogardus.ok'].seguidores.push(userMap['juanperez']._id);
    }
    if (userMap['juanperez'] && userMap['danny_proyectil']) {
      userMap['juanperez'].siguiendo.push(userMap['danny_proyectil']._id);
      userMap['danny_proyectil'].seguidores.push(userMap['juanperez']._id);
    }

    // Lacrifagia sigue a Danny Proyectil, Las Maldiciones, Para Salir de la Oscuridad y Mientras el Lobo
    if (userMap['lacrifagia.banda']) {
      ['danny_proyectil', 'las.maldiciones', 'parasalirdelaoscuridad', 'mientraselobo'].forEach(targetUsername => {
        if (userMap[targetUsername]) {
          userMap['lacrifagia.banda'].siguiendo.push(userMap[targetUsername]._id);
          userMap[targetUsername].seguidores.push(userMap['lacrifagia.banda']._id);
        }
      });
    }

    // Danny Proyectil sigue a Lacrifagia, Bogardus y Entre Penumbras
    if (userMap['danny_proyectil']) {
      ['lacrifagia.banda', 'bogardus.ok', 'entrepenumbras'].forEach(targetUsername => {
        if (userMap[targetUsername]) {
          userMap['danny_proyectil'].siguiendo.push(userMap[targetUsername]._id);
          userMap[targetUsername].seguidores.push(userMap['danny_proyectil']._id);
        }
      });
    }

    // Bogardus sigue a Utópico Amanecer y black midi
    if (userMap['bogardus.ok']) {
      ['utopico.amanecer', 'bmblackmidi', 'lacrifagia.banda'].forEach(targetUsername => {
        if (userMap[targetUsername]) {
          userMap['bogardus.ok'].siguiendo.push(userMap[targetUsername]._id);
          userMap[targetUsername].seguidores.push(userMap['bogardus.ok']._id);
        }
      });
    }

    // Favorito de Juan Perez
    if (userMap['juanperez'] && seededEvents[0]) {
      userMap['juanperez'].favoritos.push(seededEvents[0]._id);
    }

    for (const u of Object.values(userMap)) {
      await u.save();
    }

    console.log(`✓ ${seededEvents.length} eventos under cargados con éxito`);
    console.log(`✓ ${seededUsers.length} usuarios con perfiles completos y lemas cargados con éxito`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();