const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    vegan: { type: Boolean, required: true },
    vegetarian: { type: Boolean, required: true },
    allergens: { type: [String], required: true },
    ingredients: { type: [String], required: true },
    nutritionalInfo: { type: Object, required: true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
