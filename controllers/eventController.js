const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    // Buscamos y ordenamos por fecha ascendente (.sort({ fecha: 1 }))
    const eventos = await Event.find().sort({ fecha: 1 });

    // Si no hay eventos, devolvemos array vacío (Status 200 OK)
    res.status(200).json(eventos);

  } catch (error) {
    // Error con código y mensaje descriptivo
    res.status(500).json({ 
      codigo: 'ERR_FETCH_EVENTS',
      mensaje: 'Hubo un problema al obtener el listado de eventos.',
      error: error.message 
    });
  }
};

module.exports = { getEvents };