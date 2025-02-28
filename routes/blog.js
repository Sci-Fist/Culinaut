const express = require('express');
const BlogPost = require('../models/BlogPost');

const router = express.Router();

router.get('/blog', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
