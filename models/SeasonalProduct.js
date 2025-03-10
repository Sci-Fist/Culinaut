const mongoose = require('mongoose');

const seasonalProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    months: { type: String, required: true },
    availability: { type: [Number], required: true }, // Array of month indices (0-11)
    image: { type: String, required: true }, // Add image field
    description: { type: String, required: true } // Add description field
});

module.exports = mongoose.model('SeasonalProduct', seasonalProductSchema);
