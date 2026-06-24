const mongoose = require('mongoose');
const Event = require('../models/Event');

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creador: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tus eventos' });
  }
};

// @desc    Obtener lista de eventos con filtros opcionales
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    const { genero, lugar, fecha, limit, artist } = req.query;
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

    // 4. Filtro por Artista (búsqueda RegExp case-insensitive sobre artistas[].nombre)
    if (artist) {
      filter['artistas.nombre'] = new RegExp(artist, 'i');
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
    res.status(500).json({ mensaje: 'Error al obtener los eventos', error: error.message });
  }
};

// @desc    Obtener detalle de un evento por ID
// @route   GET /api/events/:id
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
    res.status(500).json({ mensaje: 'Error al obtener el detalle del evento', error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const body = req.body;
    
    // Parsear location y artistas que vienen como string desde el form
    const parsedCoordinates = body.coordinates ? JSON.parse(body.coordinates) : null;
    const artistas = body.artistas ? JSON.parse(body.artistas) : [];
    const generos = body.generos ? JSON.parse(body.generos) : [];

    const eventData = {
      ...body,
      creador: req.user._id,
      artistas,
      generos,
      imagen: req.file ? req.file.path : '' // URL de Cloudinary
    };

    // Guardar la ubicación si hay coordenadas válidas (y no son [0, 0])
    if (Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2 && 
        typeof parsedCoordinates[0] === 'number' && typeof parsedCoordinates[1] === 'number' &&
        !(parsedCoordinates[0] === 0 && parsedCoordinates[1] === 0)) {
      eventData.location = { type: 'Point', coordinates: parsedCoordinates };
    }

    const nuevoEvento = await Event.create(eventData);

    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear evento', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    // Validación de autoría estricta
    if (event.creador.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este evento' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar evento' });
  }
};

const changeEventStatus = async (req, res, status) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    if (event.creador.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este evento' });
    }

    event.estadoPublicacion = status;
    await event.save();
    res.json({ mensaje: `Evento ${status.toLowerCase()}` });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al cambiar estado' });
  }
};

const pauseEvent = (req, res) => changeEventStatus(req, res, 'PAUSADO');
const cancelEvent = (req, res) => changeEventStatus(req, res, 'CANCELADO');

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    if (event.creador.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este evento' });
    }

    await event.deleteOne();
    res.json({ mensaje: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
};

module.exports = { getEvents, getEventById, getMyEvents, createEvent, updateEvent, pauseEvent, cancelEvent, deleteEvent };