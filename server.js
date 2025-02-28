const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blog');
const menuRoutes = require('./routes/menu');
const seasonalRoutes = require('./routes/seasonal');
const contactRoutes = require('./routes/contact');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Routes
app.use('/api/blog', blogRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/seasonal', seasonalRoutes);
app.use('/api/contact', contactRoutes);

// Database connection
mongoose.connect('mongodb://localhost:27017/restaurantdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
})
.catch(error => console.error('MongoDB connection error:', error));
