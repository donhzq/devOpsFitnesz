"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport/passport");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const client = require("prom-client"); // Prometheus kliens importálása

const app = (0, express_1.default)();
const port = 5000;
const dbUrl = process.env.MONGO_DB_ENV || 'mongodb://localhost:27017/fitnesz';

// MongoDB kapcsolat
mongoose_1.default.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});

// CORS beállítások
const whitelist = ['*', 'http://localhost:4200', 'http://fitnesz'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));

// BodyParser
app.use(body_parser_1.default.urlencoded({ extended: true }));
// CookieParser
app.use((0, cookie_parser_1.default)());
// Session
const sessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use((0, express_session_1.default)(sessionOptions));

// Passport.js konfigurálás
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)(passport_1.default);

// Prometheus Registry létrehozása
const register = new client.Registry();
client.collectDefaultMetrics({ register });



// Példa metrika hozzáadása
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'HTTP requests total',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware a metrikák számolásához
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    });
    next();
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    console.log('Metrics endpoint called');
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
});


// Routes
app.use('/app', (0, routes_1.configureRoutes)(passport_1.default, express_1.default.Router()));

// Szerver indítása
app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});
console.log('After server is ready.');
//# sourceMappingURL=index.js.map
