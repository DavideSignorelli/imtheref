const express = require('express');
const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const userRouter = express.Router();
const { findByEmail } = require('../utils/user');
const passport = require('passport');
const isLoggedIn = require('../utils/passport');
const { PrismaClient } = require('@prisma/client');
var nodemailer = require('nodemailer');


const prisma = new PrismaClient();

userRouter.post('/registrazione', async (req, res) => {
    const { username, password, email } = req.body;
    if (await findByEmail(email)) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            email
        }
    });
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("hash", "codice");

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch("https://signorellidavide5ib.altervista.org/inviamail.php", requestOptions)
        .catch((error) => console.error(error));
    res.json(user);
});

userRouter.post('/login', passport.authenticate('local'), async (req, res) => {
    const user = req.user;
    const attivato = await findByEmail(user.email);
    if (!attivato.attivazione) {
        return res.status(401).json('Account non attivato');
    }
    req.login(user, function (err) {
        if (err) { return res.status(401) }
        return res.status(200).json(user)
    });
});

userRouter.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json('Ok ti sei sloggato');
    });
});

userRouter.get('/isloggedin', isLoggedIn, function (req, res) {
    res.status(200).json('Ok sei sloggato');
});

userRouter.get('/attivazione', async (req, res) => {
    const email = req.query.email;
    const token = req.query.token;
    if (token == CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex)) {
        await prisma.user.update({
            where: { email: email },
            data: { attivazione: true }
        });
        res.status(200).json('Account attivato');
    }
    else {
        res.status(401).json('Token non valido');
    }
});

userRouter.use((req, res, next) => {
    res.status(405).json({ error: 'Metodo non autorizzato' });
});

module.exports = userRouter;