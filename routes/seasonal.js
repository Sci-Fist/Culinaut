const express = require('express');
const SeasonalProduct = require('../models/SeasonalProduct');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await SeasonalProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add other routes for seasonal products as needed

module.exports = router;
