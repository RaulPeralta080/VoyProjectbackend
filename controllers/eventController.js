const { Types: { ObjectId } } = require('mongoose');
const Event = require('../models/Event');
const { fetchEventsWithFilter, findEventById } = require('../services/eventService');

const getEvents = async (req, res) => {
  try {
    const eventos = await fetchEventsWithFilter(req.query);
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los eventos' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de evento inválido' });
    }

    const evento = await findEventById(id);
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el detalle del evento' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto || !texto.trim()) {
      return res.status(400).json({ mensaje: 'El texto del comentario no puede estar vacío' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    event.comentarios.push({
      usuario: req.user._id,
      texto: texto.trim()
    });

    await event.save();

    const updatedEvent = await Event.findById(id)
      .populate('creador', 'nombre username avatar')
      .populate('comentarios.usuario', 'nombre username avatar avatarUrl fotoPerfil avatarColor role rol');

    res.status(201).json(updatedEvent.comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar el comentario' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    const comment = event.comentarios.id(commentId);
    if (!comment) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado' });
    }

    const isAuthor = comment.usuario.toString() === req.user._id.toString();
    const isEventOwner = event.creador.toString() === req.user._id.toString();

    if (!isAuthor && !isEventOwner) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este comentario' });
    }

    comment.deleteOne();
    await event.save();

    res.json({ mensaje: 'Comentario eliminado correctamente', commentId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el comentario' });
  }
};

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
    
    // Parsear location y artistas que vienen como string desde el form (o ya como arrays si es JSON)
    const coordinates = typeof body.coordinates === 'string' ? JSON.parse(body.coordinates) : (body.coordinates || [0, 0]);
    const artistas = typeof body.artistas === 'string' ? JSON.parse(body.artistas) : (body.artistas || []);
    const generos = typeof body.generos === 'string' ? JSON.parse(body.generos) : (body.generos || []);

    const nuevoEvento = await Event.create({
      ...body,
      creador: req.user._id,
      location: { type: 'Point', coordinates },
      artistas,
      generos,
      imagen: req.file ? req.file.path : (body.imagen || '')
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

    const body = { ...req.body };
    if (body.coordinates) {
      body.location = { type: 'Point', coordinates: body.coordinates };
    }

    event = await Event.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    res.json(event);
  } catch (error) {
    console.error("Error en updateEvent:", error);
    res.status(400).json({ mensaje: error.message || 'Error al actualizar evento' });
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

module.exports = {
  getEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  pauseEvent,
  cancelEvent,
  deleteEvent,
  addComment,
  deleteComment
};
