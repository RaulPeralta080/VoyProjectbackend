const Event = require('../models/Event');

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creador: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tus eventos' });
  }
};

const createEvent = async (req, res) => {
  try {
    const body = req.body;
    
    // Parsear location y artistas que vienen como string desde el form
    const coordinates = body.coordinates ? JSON.parse(body.coordinates) : [0, 0];
    const artistas = body.artistas ? JSON.parse(body.artistas) : [];
    const generos = body.generos ? JSON.parse(body.generos) : [];

    const nuevoEvento = await Event.create({
      ...body,
      creador: req.user._id,
      location: { type: 'Point', coordinates },
      artistas,
      generos,
      imagen: req.file ? req.file.path : '' // URL de Cloudinary
    });

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

module.exports = { getMyEvents, createEvent, updateEvent, pauseEvent, cancelEvent, deleteEvent };
