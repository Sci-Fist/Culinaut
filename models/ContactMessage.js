const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    type: { type: String, required: true },
     { type: Object, required: true }, // Added name to the data field
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
