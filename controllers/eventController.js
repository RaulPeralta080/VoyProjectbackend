const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    // Obtenemos los eventos ordenados por fecha ascendente
    const eventos = await Event.find().sort({ fecha: 1 });

    // El campo 'estado' se incluirá automáticamente gracias al virtual definido en el modelo
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