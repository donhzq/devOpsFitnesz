const express = require("express");
const client = require("prom-client");

const app = express();
const port = 5001; // A metrikákhoz dedikált port

// Prometheus Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Példa saját metrika hozzáadására
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'HTTP requests total',
    labelNames: ['method', 'route', 'status'],
});

// Regisztráld az egyedi metrikát a registry-ben
register.registerMetric(httpRequestCounter);

// Metrikák endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (err) {
        res.status(500).send(`Metrikák hiba: ${err.message}`);
    }
});

// Példa HTTP kérés metrika számolására
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.route ? req.route.path : req.url, res.statusCode).inc();
    });
    next();
});

// Szerver indítása
app.listen(port, () => {
    console.log(`> Metrics server is running on port ${port}`);
});
