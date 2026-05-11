const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
=======
    // Si process.env.MONGO_URI es undefined, tirará el error que viste.
>>>>>>> dfffbefead421cc154dcb2300e569dd5935f1fd3
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Detiene el proceso si falla la conexión
  }
};

module.exports = connectDB;