const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.get('/menu', async (req, res) => {
    try {
        const items = await MenuItem.find().sort({ name: 1 }); // Sort by name ascending
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
