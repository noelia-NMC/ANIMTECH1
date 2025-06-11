const Evento = require('../models/evento.model');

exports.getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({ userId: req.user.id }).sort('date');
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos', error });
  }
};

exports.createEvento = async (req, res) => {
  try {
    const { title, date, notes, type } = req.body;
    const nuevoEvento = new Evento({
      title,
      date,
      notes,
      type,
      userId: req.user.id, 
    });
    await nuevoEvento.save();
    res.status(201).json({ message: 'Evento creado exitosamente', evento: nuevoEvento });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el evento', error });
  }
};

exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado o no tienes permiso para eliminarlo' });
    }
    res.status(200).json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el evento', error });
  }
};