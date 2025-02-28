const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add other routes for menu items as needed

module.exports = router;
