const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: String, required: true },
    tags: { type: [String], required: true },
    categories: { type: [String], required: true }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
