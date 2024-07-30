const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Add other fields if necessary
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
