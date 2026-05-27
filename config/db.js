const mongoose = require('mongoose');

const connectDB = async () => {
<<<<<<< HEAD
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[36m✓ MongoDB conectado: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✗ Error DB: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};


module.exports = connectDB; 
=======
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[36m✓ MongoDB conectado: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✗ Error DB: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};


module.exports = connectDB;
>>>>>>> 5ca3f5c94fa93eae54057201ae84b7f8bae98f6b
