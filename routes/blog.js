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

router.post('/blog', async (req, res) => {
    const post = new BlogPost(req.body);
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
