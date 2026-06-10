const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre:   { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email:    { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: [true, 'La contraseña es obligatoria'], select: false },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  perfilPublico: { type: Boolean, default: true },
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  siguiendo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);