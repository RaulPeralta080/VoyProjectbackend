const { Types: { ObjectId } } = require('mongoose');
const Event = require('../models/Event');

const ARTIST_POPULATE_FIELDS = 'nombre username avatar avatarUrl fotoPerfil avatarColor bannerImagen bannerGradiente bannerColor lema bio role rol redesSociales';

const fetchEventsWithFilter = async (queryParams) => {
  const { genero, lugar, fecha, limit, artist, maxPrice } = queryParams;
  let filter = {};

  if (genero) {
    const generosArray = genero.split(',').map(g => g.trim());
    filter.generos = { $in: generosArray.map(g => new RegExp(`^${g}$`, 'i')) };
  }

  if (lugar) {
    filter.lugar = new RegExp(lugar, 'i');
  }

  if (artist) {
    filter['artistas.nombre'] = new RegExp(artist, 'i');
  }

  if (fecha) {
    const parsedDate = new Date(fecha);
    if (!isNaN(parsedDate.getTime())) {
      const startOfDay = new Date(fecha);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(fecha);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.fecha = { $gte: startOfDay, $lte: endOfDay };
    }
  }

  if (maxPrice) {
    filter.precio = { $lte: Number(maxPrice) };
  }

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  filter.fecha = { ...filter.fecha, $gte: startOfToday };
  filter.estadoPublicacion = { $nin: ['PAUSADO', 'CANCELADO'] };

  let query = Event.find(filter)
    .sort({ fecha: 1 })
    .populate('creador', 'nombre username avatar')
    .populate('artistas.usuario', ARTIST_POPULATE_FIELDS);

  const parsedLimit = parseInt(limit);
  if (!isNaN(parsedLimit) && parsedLimit > 0) {
    query = query.limit(parsedLimit);
  }

  return await query;
};

const findEventById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return await Event.findById(id)
    .populate('creador', 'nombre username avatar')
    .populate('artistas.usuario', ARTIST_POPULATE_FIELDS)
    .populate('comentarios.usuario', 'nombre username avatar avatarUrl fotoPerfil avatarColor role rol');
};

module.exports = {
  fetchEventsWithFilter,
  findEventById
};
