const express = require('express');
const axios = require('axios');
const app = express();
const config = require('./config');

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to fetch all available metric names
app.get('/api/metrics', async (req, res) => {
    try {
        const response = await axios.get(`http://${config.ENDPOINT}:${config.PROMETHEUS_PORT}/api/v1/label/__name__/values`);
        // metric names are available at .data
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching available metrics:', error);
        res.status(500).send('Error fetching metrics');
    }
});

// Endpoint to fetch data for a specific metric
app.get('/api/query', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }
    try {
        const response = await axios.get(`http://${config.ENDPOINT}:${config.PROMETHEUS_PORT}/api/v1/query`, {
            params: {
                query: query
            }
        });
        // metric data is available at .data
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data for query ${query}:`, error);
        res.status(500).send('Error fetching query data');
    }
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
});
