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
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            res.status(400).json({ error: 'Email e password sono obbligatorie' });
            return;
        }
        if (await findByEmail(email)) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                email
            }
        });
        const formdata = new FormData();
        formdata.append("email", email); ///////////////////////////////////////////////inviare un codice decente PLS

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://signorellidavide5ib.altervista.org/inviamail.php", requestOptions)
            .catch((error) => console.error(error));
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore interno' });
    }

});

userRouter.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        try {
            if (err) {
                return next(err); // Passa l'errore al gestore degli errori
            }
            if (!user) {
                return res.status(401).json(info.message); // Utente non trovato o credenziali errate
            }
            const attivato = await findByEmail(user.email);
            if (!attivato.attivazione) {
                return res.status(401).json('Account non attivato'); // Account non attivato
            } else {
                req.login(user, function (err) {
                    if (err) {
                        return next(err); // Passa l'errore al gestore degli errori
                    }
                    return res.status(200).json(user); // Login riuscito
                });
            }
        } catch (error) {
            return next(error); // Passa l'errore al gestore degli errori
        }
    })(req, res, next);
});


userRouter.get('/logout', function (req, res, next) {
    try {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.status(200).json('Ok ti sei sloggato');
        });
    }
    catch (error) {
        res.status(500).json('Errore interno');
    }
});

userRouter.get('/isloggedin', isLoggedIn, function (req, res) {
    try {
        res.status(200).json('Ok sei loggato');
    }
    catch (error) {
        res.status(500).json('Errore interno');
    }

});

userRouter.get('/attivazione', async (req, res) => {
    try {
        if (!req.query.email || !req.query.token) {
            return res.status(400).json('Email e token sono obbligatori');
        }
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
    }
    catch (error) {
        res.status(500).json('Errore interno');
    }
});

userRouter.use((req, res, next) => {
    try {
        res.status(405).json({ error: 'Metodo non autorizzato' });
    }
    catch (error) {
        res.status(500).json('Errore interno');
    }
});

module.exports = userRouter;