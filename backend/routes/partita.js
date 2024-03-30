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
partitaRouter.get('/visualizza', isLoggedIn, async (req, res) => {
    const partite = await prisma.partita.findMany({
        where: {
            userId: req.session.passport.user
        }
    });
    res.json(partite);
});

partitaRouter.put('/modifica/:id', isLoggedIn, async (req, res) => {
    const { nome, data, categoria, rimborso, voto } = req.body;
    console.log('Dati ricevuti:', { nome, data, categoria, rimborso, voto }); // Verifica i dati ricevuti
    const partita = await prisma.partita.update({
        where: {
            id: req.params.id
        },
        data: {
            nome,
            data,
            categoria,
            rimborso,
            voto
        }
    });
    res.json(partita);
});








module.exports = partitaRouter;