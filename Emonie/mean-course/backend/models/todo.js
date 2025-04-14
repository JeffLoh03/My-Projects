const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Mindfulness', 'Exercise', 'Self Care']
  },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema); 