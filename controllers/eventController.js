const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { nombre: searchRegex },
        { 'artistas.nombre': searchRegex }
      ];
    }

    const { search, ...otrosFiltros } = req.query;

    if (otrosFiltros.genero) {
      query.generos = new RegExp(otrosFiltros.genero, 'i');
      delete otrosFiltros.genero;
    }

    Object.assign(query, otrosFiltros);

    const eventos = await Event.find(query).sort({ fecha: 1 });

    // El campo 'estado' se incluirá automáticamente (aca no tocar nada porfa)
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ 
      codigo: 'ERR_CARD_MINIMA',
      mensaje: 'Error al procesar los datos para la card mínima.',
      error: error.message 
    });
  }
};

module.exports = { getEvents };