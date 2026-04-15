const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS ---
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
// -------------

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de VOY funcionando correctamente' });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`.yellow.bold);
});