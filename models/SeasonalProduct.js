const mongoose = require('mongoose');

const seasonalProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    months: { type: String, required: true },
    availability: { type: [Number], required: true } // Array of month indices (0-11)
});

module.exports = mongoose.model('SeasonalProduct', seasonalProductSchema);
