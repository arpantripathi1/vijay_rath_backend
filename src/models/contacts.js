const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
  phone: {
    type: String,
    required: true
  },
  // Add other fields if necessary
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
