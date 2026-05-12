const mongoose = require('mongoose');
const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const { genero, lugar, fecha, limit } = req.query;
    let filter = {};

    // 1. Filtro por Género (acepta múltiples separados por coma)
    if (genero) {
      const generosArray = genero.split(',').map(g => g.trim());
      // Búsqueda case-insensitive para cada género
      filter.generos = { $in: generosArray.map(g => new RegExp(`^${g}$`, 'i')) };
    }

    // 2. Filtro por Lugar
    if (lugar) {
      filter.lugar = new RegExp(lugar, 'i');
    }

    // 3. Filtro por Fecha
    if (fecha) {
      const parsedDate = new Date(fecha);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ 
          mensaje: 'El parámetro de fecha proporcionado es inválido. Use formato YYYY-MM-DD.' 
        });
      }
      
      const startOfDay = new Date(fecha);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(fecha);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.fecha = { $gte: startOfDay, $lte: endOfDay };
    }

    // Obtenemos los eventos ordenados por fecha ascendente y aplicamos el filtro
    let eventosQuery = Event.find(filter).sort({ fecha: 1 });
    
    // 4. Límite de resultados (Opcional)
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        eventosQuery = eventosQuery.limit(limitNum);
      }
    }

    const eventos = await eventosQuery;

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ 
      codigo: 'ERR_CARD_MINIMA',
      mensaje: 'Error al procesar los datos para la card mínima.',
      error: error.message 
    });
  }
};

// --- NUEVA FUNCIÓN PARA CARD MÁXIMA ---
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar si el ID es un ObjectId de MongoDB válido (CRÍTICO)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        mensaje: 'ID de evento inválido' 
      });
    }

    const evento = await Event.findById(id);

    // Si el ID es válido pero no existe el evento
    if (!evento) {
      return res.status(404).json({ 
        mensaje: 'Evento no encontrado' 
      });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener el detalle del evento',
      error: error.message 
    });
  }
};

module.exports = { getEvents, getEventById };
