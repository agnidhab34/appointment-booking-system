const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: [true, 'Date is required']
  },
  startTime: {
    type: String, // format: HH:mm
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String, // format: HH:mm
    required: [true, 'End time is required']
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

// Prevent a provider from creating the exact same slot twice
availabilitySchema.index(
  { providerId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
