const express = require('express');
const passport = require('passport');
const app = express();
const port = 3000;
//const provaRouter = require('./routes/prova');
const userRouter = require('./routes/user');

app.use(express.json());
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

//app.use('/api/prova', provaRouter);
app.use('/api/user', userRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});