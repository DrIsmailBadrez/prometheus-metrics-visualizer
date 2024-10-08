# Prometheus Metrics Visualizer

This project is a **Prometheus Metrics Visualizer** built with **Express.js** on the backend and a **HTML/JavaScript frontend** that uses **Chart.js** to display metric data from Prometheus.

## Table of Contents
- [Description](#description)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Endpoints](#endpoints)

## Description
This application fetches metric names and their corresponding data from a Prometheus server. It allows users to:
- View all available Prometheus metrics.
- Select a specific metric and visualize its data in a table and chart.
- Display raw JSON data of the selected metric query.

The backend communicates with a Prometheus API using **Axios** and serves the data to the frontend.

## Requirements
- **Node.js** (version 12 or higher)
- **npm** (Make sure that **npm** is installed. You can check by running `npm -v` in your terminal. If not installed, download it from [here](https://www.npmjs.com/get-npm).)
- A running **Prometheus server** to query for metrics

## Installation
1. Clone this repository:
    ```bash
    git clone https://github.com/DrIsmailBadrez/prometheus-metrics-visualizer.git
    cd prometheus-metrics-visualizer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Create a `config.js` file in the root of the project directory. This file should contain the following configuration details:
    ```javascript
    module.exports = {
        ENDPOINT: '128.110.217.42', // Prometheus server host
        PROMETHEUS_PORT: 9090, // Prometheus server port
        HOST: 'localhost', // Host where the Express server will run
        PORT: 3000 // Port for Express server
    };
    ```

2. Modify the values of `ENDPOINT`, `PROMETHEUS_PORT`, `HOST`, and `PORT` as necessary to match your environment.

## Running the Application
To start the application, run:
    ```bash
    node app.js
    ```
This will start the Express server and serve the frontend at [http://localhost:3000](http://localhost:3000) (or whatever value you have set for `HOST` and `PORT` in your `config.js` file).

## Usage
1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. The page will load with a dropdown showing available Prometheus metrics.
3. Select a metric from the dropdown to:
   - View the metric data in a table format.
   - Display a bar chart visualizing the metric data.
   - See the raw JSON data from the Prometheus query.

## Endpoints

### `/api/metrics` (GET)
- Fetches all available metric names from Prometheus.
- **Response**: A list of metric names.

### `/api/query` (GET)
- Fetches data for a specific metric query.
- **Parameters**: `query` (required) - The Prometheus query to fetch data for.
- **Response**: Metric data returned by Prometheus for the provided query.
