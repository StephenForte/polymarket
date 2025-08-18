const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Proxy endpoint for Polymarket API
app.get('/api/markets', async (req, res) => {
    try {
        const { closed, limit, category, search } = req.query;
        let url = 'https://gamma-api.polymarket.com/markets';
        
        const params = new URLSearchParams();
        if (closed !== undefined) params.append('closed', closed);
        if (limit) params.append('limit', limit);
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        console.log('Proxying request to:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch data from Polymarket API' });
    }
});

// Proxy endpoint for individual market details
app.get('/api/markets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://gamma-api.polymarket.com/markets/${id}`;
        
        console.log('Proxying market details request to:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch market details' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API proxy available at http://localhost:${PORT}/api/markets`);
});
