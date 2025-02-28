const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    author: { type: String, required: true },
    tags: [{ type: String }],
    categories: [{ type: String }],
    featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
