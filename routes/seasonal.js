const express = require('express');
const SeasonalProduct = require('../models/SeasonalProduct');

const router = express.Router();

router.get('/seasonal', async (req, res) => {
    try {
        const products = await SeasonalProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
