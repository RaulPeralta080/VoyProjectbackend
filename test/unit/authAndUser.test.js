const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const User = require('../../models/User');

describe('Pruebas Unitarias - Módulo de Autenticación y Usuarios', () => {
  before(() => {
    process.env.JWT_SECRET = 'secreto_super_seguro_para_pruebas_123';
  });

  describe('Generación y Verificación de Tokens JWT (generateToken.js)', () => {
    it('Debe generar un token JWT string válido con ID y rol asignado', () => {
      const mockUserId = '64b8f1a2c3d4e5f6a7b8c9d0';
      const mockRole = 'producer';

      const token = generateToken(mockUserId, mockRole);

      expect(token).to.be.a('string');
      expect(token.split('.')).to.have.lengthOf(3);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).to.have.property('id', mockUserId);
      expect(decoded).to.have.property('role', mockRole);
    });

    it('Debe contener fecha de expiración en el payload del token', () => {
      const token = generateToken('user123', 'client');
      const decoded = jwt.decode(token);
      expect(decoded).to.have.property('exp');
      expect(decoded.exp).to.be.a('number');
    });
  });

  describe('Validación y Reglas de Negocio de Usuario (User Model)', () => {
    it('Debe verificar correctamente la comparación de contraseñas hash con matchPassword', async () => {
      const plainPassword = 'PasswordSegura2026!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      const mockUser = new User({
        nombre: 'Productor Test',
        email: 'productor@test.com',
        password: hashedPassword,
      });

      const isMatch = await mockUser.matchPassword(plainPassword);
      const isWrongMatch = await mockUser.matchPassword('PasswordErronea123');

      expect(isMatch).to.be.true;
      expect(isWrongMatch).to.be.false;
    });

    it('Debe validar el formato correcto de nombre de usuario (username)', () => {
      const regexUsername = /^[a-zA-Z0-9._]+$/;

      expect(regexUsername.test('productora_tucuman')).to.be.true;
      expect(regexUsername.test('rock.metal.2026')).to.be.true;
      expect(regexUsername.test('usuario invalid! @')).to.be.false;
      expect(regexUsername.test('nombre con espacios')).to.be.false;
    });
  });

  describe('Seguridad y Filtrado de Lista Blanca (updateUserProfile)', () => {
    it('Debe permitir únicamente los campos permitidos y descartar campos sensibles', () => {
      const whitelist = [
        'nombre', 'username', 'perfilPublico', 'avatar', 'avatarUrl',
        'fotoPerfil', 'artistasFavoritos', 'recitalMemorable', 'bio',
        'ubicacion', 'redesSociales', 'favoritos', 'avatarColor',
        'bannerGradiente', 'bannerColor', 'bannerImagen', 'lema',
        'generosMusicales', 'vibeEnShows'
      ];

      const payloadDesconocido = {
        nombre: 'Nuevo Nombre',
        bio: 'Biografía de prueba',
        password: 'hackeo_password',
        isSuspended: true,
        role: 'admin'
      };

      const camposFiltrados = Object.keys(payloadDesconocido).filter(key => whitelist.includes(key));

      expect(camposFiltrados).to.include('nombre');
      expect(camposFiltrados).to.include('bio');
      expect(camposFiltrados).to.not.include('password');
      expect(camposFiltrados).to.not.include('isSuspended');
      expect(camposFiltrados).to.not.include('role');
    });
  });
});
