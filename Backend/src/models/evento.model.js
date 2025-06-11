// 📁 backend/src/models/evento.model.js

const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  date: {
    type: String, // Guardaremos la fecha como string en formato 'YYYY-MM-DD'
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['veterinario', 'vacuna', 'comida', 'baño', 'paseo', 'otro'],
    default: 'otro',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de Usuario
    required: true,
  }
}, {
  timestamps: true // Para saber cuándo fue creado
});

module.exports = mongoose.model('Evento', EventoSchema);