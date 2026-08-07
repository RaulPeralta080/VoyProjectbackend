const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function cleanFollows() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para limpiar seguidores fake...');

    const users = await User.find({});
    console.log(`Encontrados ${users.length} usuarios.`);

    // Nombres de usuario seeded que tenian relaciones falsas iniciales
    const seededUsernames = [
      'juanperez', 'danny_proyectil', 'las.maldiciones', 'alas.maldiciones', 
      'parasalirdelaoscuridad', 'mientraselobo', 'lacrifagia.banda', 
      'bogardus.ok', 'utopico.amanecer', 'bmblackmidi', 'entrepenumbras'
    ];

    const seededUsers = await User.find({ username: { $in: seededUsernames } });
    const seededIds = new Set(seededUsers.map(u => u._id.toString()));

    for (const u of users) {
      const isSeeded = seededUsernames.includes(u.username);
      
      if (isSeeded) {
        // Para los usuarios seeded, filtramos solo las conexiones entre usuarios seeded que fueron precargadas
        const origSeguidoresCount = u.seguidores.length;
        const origSiguiendoCount = u.siguiendo.length;

        // Mantener solo a aquellos que NO sean usuarios de la lista seeded, O mantener relaciones si un usuario real lo sigue
        // En este caso, si u es seeded, limpiamos sus relaciones iniciales seeded
        u.seguidores = u.seguidores.filter(id => !seededIds.has(id.toString()));
        u.siguiendo = u.siguiendo.filter(id => !seededIds.has(id.toString()));

        if (u.seguidores.length !== origSeguidoresCount || u.siguiendo.length !== origSiguiendoCount) {
          await u.save();
          console.log(`✓ Limpiadas conexiones fake para @${u.username} (Seguidores: ${origSeguidoresCount} -> ${u.seguidores.length}, Siguiendo: ${origSiguiendoCount} -> ${u.siguiendo.length})`);
        }
      }
    }

    console.log('✓ Limpieza completada.');
    process.exit(0);
  } catch (err) {
    console.error('Error al limpiar:', err);
    process.exit(1);
  }
}

cleanFollows();
