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
// Endpoint to fetch data for a specific metric with optional latency calculation
app.get('/api/query', async (req, res) => {
    const isLatencyQuery = req.query.latency === 'true';

    if (isLatencyQuery) {
        // Handle message latency query
        const querySent = 'messageSentTimestamp';
        const queryReceived = 'messageReceivedTimestamp';

        try {
            // Fetch messageSentTimestamp data
            const sentResponse = await axios.get(`http://${config.ENDPOINT}:${config.PROMETHEUS_PORT}/api/v1/query`, {
                params: { query: querySent }
            });
            // console.log('sentResponse: ', sentResponse.data.data.result);
            // Fetch messageReceivedTimestamp data
            const receivedResponse = await axios.get(`http://${config.ENDPOINT}:${config.PROMETHEUS_PORT}/api/v1/query`, {
                params: { query: queryReceived }
            });
            // console.log('receivedResponse: ', receivedResponse.data.data.result);

            if (sentResponse.data.status !== 'success' || receivedResponse.data.status !== 'success') {
                return res.status(500).send('Error fetching query data');
            }

            // Create a map for sent timestamps keyed by hash
            const sentTimestamps = new Map();
            sentResponse.data.data.result.forEach(item => {
                console.log(item.value);
                sentTimestamps.set(item.metric.hash, parseFloat(item.value[1]));
            });

            // Prepare the response array with latency calculations
            const resultWithLatency = receivedResponse.data.data.result.map(item => {
                const receivedTime = parseFloat(item.value[1]);
                const hash = item.metric.hash;
                const sentTime = sentTimestamps.get(hash);
                const latency = sentTime && receivedTime
                ? Math.abs(receivedTime - sentTime) / 1_000_000_000
                : null;

                return {
                    instance: item.metric.instance || 'N/A',
                    job: item.metric.job || 'N/A',
                    hash: hash,
                    sentTimestamp: sentTime,
                    receivedTimestamp: receivedTime,
                    latency: latency // Add latency field
                };
            });

            res.json({
                status: 'success',
                data: resultWithLatency
            });

        } catch (error) {
            console.error('Error fetching data for query:', error);
            res.status(500).send('Error fetching query data');
        }
    } else {
        // Default behavior: fetch specific metric data
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
            res.json(response.data);
        } catch (error) {
            console.error(`Error fetching data for query ${query}:`, error);
            res.status(500).send('Error fetching query data');
        }
    }
});


// Start server
app.listen(config.PORT, () => {
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
});
