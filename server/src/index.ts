import { MainClass } from './main-class';
import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import client from 'prom-client'; // Prometheus kliens importálása

const app = express();
const port = 5000;
const dbUrl = process.env.MONGO_DB_ENV || 'mongodb://localhost:27017/fitnesz';

// MongoDB kapcsolat
mongoose.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB. letsgo');
}).catch(error => {
    console.log(error);
    return;
});

// CORS beállítások
const whitelist = ['*', 'http://localhost:4200' , 'http://fitnesz'];
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// CookieParser
app.use(cookieParser());

// Session
const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

// Passport.js konfigurálás
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Prometheus Registry létrehozása
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Egyedi metrikák hozzáadása
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'HTTP requests total',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware a metrikák számolásához
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
    });
    next();
});

// Prometheus metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
});

// Routes
app.use('/app', configureRoutes(passport, express.Router()));

// Szerver indítása
app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});
console.log('After server is ready.');
