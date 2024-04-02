const express = require('express');
var cors = require('cors')
const passport = require('passport');
const app = express();
const port = 3000;
//const provaRouter = require('./routes/prova');
const userRouter = require('./routes/user');
const partitaRouter = require('./routes/partita');

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Imposta l'origine consentita per le richieste
    credentials: true, // Consenti l'invio di credenziali (come i cookie)
}));
const session = require('express-session');
app.use(
    session({
        name: 'session',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRouter);
app.use('/api/partita', partitaRouter);

app.listen(port, () => {
    console.log(`backend listening on port ${port}`);
});