import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import compression from 'compression';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';
import config from './config';

const app = express();
const path = require('path');
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const corsOptions = {
    origin: `http://localhost:${config.PORT}`,
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(flash());
app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URI,
        mongoOptions,
    }),
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: Number(config.MAX_AGE),
        httpOnly: false,
        secure: false
    }
}));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('.hbs', engine({
    extname: '.hbs',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
}));

module.exports = app;