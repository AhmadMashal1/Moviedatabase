const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Connection URI to MongoDB Atlas
const uri = process.env.MONGODB_URI; // Use environment variable

// Use body-parser middleware
app.use(bodyParser.json());

// Serve static files to load the HTML
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect().then(() => {
    console.log("MongoDB connected successfully");

    // Set up Express routes and start the server
    app.get('/api/movies', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 10;

            const collection = client.db('sample_mflix').collection('movies');
            const query = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};

            const documents = await collection.find(query).skip((page - 1) * perPage).limit(perPage).toArray();

            res.json(documents);
        } catch (error) {
            console.error('Error fetching movie data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
