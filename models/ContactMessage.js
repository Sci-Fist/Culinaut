const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    type: { type: String, required: true },
     { type: Object, required: true },
    timestamp: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
