<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'] 
  }
}, { 
  timestamps: true 
});

// Encriptar password automáticamente antes de guardar (Criterio de aceptación)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas en el Login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
>>>>>>> dfffbefead421cc154dcb2300e569dd5935f1fd3
