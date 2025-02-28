const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

router.post('/', async (req, res) => {
    const message = new ContactMessage({
        type: req.body.type,
        data: req.body.data,
        timestamp: req.body.timestamp
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
