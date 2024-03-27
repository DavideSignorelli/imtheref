const express = require('express');
const bcrypt = require('bcryptjs');
const userRouter = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

userRouter.post('/registrazione', async (req, res) => {
    const { username, password, email } = req.body;
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

userRouter.post('/login', async (req, res) => {

});

userRouter.get('visualizza', async (req, res) => {

});

module.exports = userRouter;