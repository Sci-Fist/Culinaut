const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    type: { type: String, required: true },
     { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
