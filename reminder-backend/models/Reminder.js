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
  reminderDate: {          // Replace date + time with a single UTC Date
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Sent', 'Cancelled']
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
