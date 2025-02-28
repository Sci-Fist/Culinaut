const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blog');
const menuRoutes = require('./routes/menu');
const seasonalRoutes = require('./routes/seasonal');
const contactRoutes = require('./routes/contact');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for development
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api', blogRoutes);
app.use('/api', menuRoutes);
app.use('/api', seasonalRoutes);
app.use('/api', contactRoutes);

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
