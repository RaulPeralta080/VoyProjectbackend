const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const mongoose   = require('mongoose');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[36m✓ MongoDB conectado: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✗ Error DB: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};
connectDB();

const app = express();

// CORS — en producción acepta solo los orígenes listados en ALLOWED_ORIGINS (separados por coma)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // En desarrollo (sin ALLOWED_ORIGINS definido) permitir todo
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin no permitido → ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- DEFINICIÓN DE RUTAS ---
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));
app.use('/api/events',   require('./routes/eventRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes')); // <-- Integración de Mercado Pago
app.use('/api/users',    require('./routes/userRoutes'));

// --- MIDDLEWARES DE ERROR ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\x1b[32m✓ Servidor corriendo en puerto ${PORT}\x1b[0m`);
});
// Trigger reload
