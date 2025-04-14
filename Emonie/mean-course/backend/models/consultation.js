const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  consultationType: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Consultation', consultationSchema); 