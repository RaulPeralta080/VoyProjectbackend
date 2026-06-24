const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre:   { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email:    { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: [true, 'La contraseña es obligatoria'], select: false },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  perfilPublico: { type: Boolean, default: true },
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  siguiendo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  avatar: { type: String },
  bio: { type: String, maxlength: [280, 'La biografía no puede superar los 280 caracteres'] },
  ubicacion: { type: String },
  role: { type: String, enum: ['client', 'producer', 'admin'], default: 'client' },
  isSuspended: { type: Boolean, default: false },
  isVerifiedProducer: { type: Boolean, default: false },
  isPendingApproval: { type: Boolean, default: false },
  redesSociales: {
    instagram: { type: String, trim: true },
    spotify: { type: String, trim: true },
    youtube: { type: String, trim: true },
    web: { type: String, trim: true }
  },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId }],
  avatarColor: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^#[0-9A-Fa-f]{6}$/.test(v);
      },
      message: props => `${props.value} no es un color hexadecimal válido`
    }
  },
  bannerGradiente: { type: String },
  generosMusicales: [{ type: String }],
  vibeEnShows: [{ type: String }]
}, { timestamps: true });

// Encriptar password antes de guardar
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);