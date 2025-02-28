const express = require('express');
const BlogPost = require('../models/BlogPost');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add other routes for creating, updating, and deleting blog posts as needed

module.exports = router;
