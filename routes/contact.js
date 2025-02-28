const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

router.post('/contact', async (req, res) => {
    const message = new ContactMessage({
        type: req.body.type,
         req.body.data,
        timestamp: new Date()
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
