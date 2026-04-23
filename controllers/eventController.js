const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    // Obtenemos los eventos ordenados por fecha ascendente (revisar mas adelante cuando este integrado).
    const eventos = await Event.find().sort({ fecha: 1 });

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