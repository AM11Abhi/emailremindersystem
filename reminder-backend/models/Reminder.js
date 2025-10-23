const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Sent', 'Cancelled']
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
