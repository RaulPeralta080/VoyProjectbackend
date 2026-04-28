const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware'); // <--- NUEVO

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// --- LOGGING DE PETICIONES (Opcional pero recomendado) ---
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`.cyan);
    next();
  });
}

// --- RUTAS ---
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de VOY funcionando correctamente' });
});


// la ruta no existe (404)
app.use(notFound);

// error de código o base de datos (500)
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`.yellow.bold
  );
});