const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    allergens: [{ type: String }],
    ingredients: [{ type: String }],
    nutritionalInfo: { type: Object },
    category: { type: String, required: true }, // Add category field
    featured: { type: Boolean, default: false } // Add featured field
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
