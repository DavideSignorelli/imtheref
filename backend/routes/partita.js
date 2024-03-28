const express = require('express');
const partitaRouter = express.Router();
const isLoggedIn = require('../utils/passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

partitaRouter.post('/crea', isLoggedIn, async (req, res) => {
    const { nome, data, categoria, rimborso, voto } = req.body;
    const partita = await prisma.partita.create({
        data: {
            nome,
            data,
            categoria,
            rimborso,
            voto,
            userId: req.session.passport.user
        }
    });
    res.json(partita);
});







module.exports = partitaRouter;