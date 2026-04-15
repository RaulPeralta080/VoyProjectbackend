const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' }; 
    }
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query);
    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: 'Error al buscar eventos', error: error.message });
  }
};

module.exports = { getEvents };