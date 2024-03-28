const express = require('express');
const bcrypt = require('bcryptjs');
const userRouter = express.Router();
const { findByEmail } = require('../utils/user');
const passport = require('passport');
const isLoggedIn = require('../utils/passport');
const { PrismaClient } = require('@prisma/client');

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
    res.json(user);
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
    const user = req.user;
    req.login(user, function (err) {
        if (err) { return res.status(401) }
        return res.status(200).json(user)
    });
});

userRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json('Ok ti sei sloggato');
    });
});

userRouter.get('visualizza', async (req, res) => {

});

module.exports = userRouter;