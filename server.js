const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Allow both origins
    credentials: true,
}));
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://Krishnaji:palak07@cluster07.aqdgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster07'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema for the chat history
const chatHistorySchema = new mongoose.Schema({
    query: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the ChatBot Backend!');
});

// API to save chat history
app.post('/api/history', async (req, res) => {
    const { query } = req.body;
    const newHistory = new ChatHistory({ query });
    await newHistory.save();
    res.status(201).json(newHistory);
});

// API to fetch chat history
app.get('/api/history', async (req, res) => {
    try {
        const history = await ChatHistory.find().sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// API to delete chat history
app.delete('/api/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await ChatHistory.findByIdAndDelete(id);
        res.status(200).json({ message: 'Chat history deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete chat history' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});