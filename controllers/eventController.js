const { Types: { ObjectId } } = require('mongoose');
const Event = require('../models/Event');

// @desc    Obtener lista de eventos con filtros opcionales
// @route   GET /api/events
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
    let query = Event.find(filter).sort({ fecha: 1 });

    // Si se pasa ?limit=N, limitamos los resultados (útil para la landing preview)
    const parsedLimit = parseInt(limit);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }

    const eventos = await query;

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los eventos' });
  }
};

// @desc    Obtener detalle de un evento por ID
// @route   GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar si el ID es un ObjectId de MongoDB válido (CRÍTICO)
    if (!ObjectId.isValid(id)) {
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
    res.status(500).json({ mensaje: 'Error al obtener el detalle del evento' });
  }
};

// @desc    Crear un nuevo evento
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    const { nombre, imagen, generos, fecha, hora, lugar, precio, descripcion, artistas, stock, capacidadTotal } = req.body;
    
    if (!nombre || !fecha || !hora || !lugar) {
      return res.status(400).json({ 
        mensaje: 'Por favor, complete todos los campos obligatorios (nombre, fecha, hora, lugar)' 
      });
    }

    const nuevoEvento = await Event.create({
      nombre,
      imagen,
      generos,
      fecha,
      hora,
      lugar,
      precio,
      descripcion,
      artistas,
      stock: stock !== undefined ? stock : capacidadTotal,
      capacidadTotal
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el evento', error: error.message });
  }
};

// @desc    Actualizar un evento por ID
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de evento inválido' });
    }

    const eventoActualizado = await Event.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!eventoActualizado) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.status(200).json(eventoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el evento', error: error.message });
  }
};

// @desc    Eliminar un evento por ID
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de evento inválido' });
    }

    const eventoEliminado = await Event.findByIdAndDelete(id);

    if (!eventoEliminado) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.status(200).json({ mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el evento', error: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };