const express = require("express");
const session = require("express-session");
const dotenv = require('dotenv').config();
const http = require("http");
const next = require("next");

const multer = require("multer");
const upload = multer({ dest: 'uploads/' })
const cors = require("cors");

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const cont = require("./control.js");



nextApp.prepare().then(async() => {
    const app = express();
    app.use(cors({
        origin: [/(http|https)\:\/\/.*/],
    }));
    app.use(async function (req, res, next) {
        req.db = cont.daoCtx;
        req.control = cont;

        next()
    });
    app.use(session({
        secret: "thisismysecrctekeyfhasdfarjiob7fwir767",
        saveUninitialized:true,
        resave: false 
    }));
    app.use(express.json());
    app.use(upload.array('files[]', 10));
    const server = http.createServer(app);
    
    app.all('*', (req, res) => nextHandler(req, res));


    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});