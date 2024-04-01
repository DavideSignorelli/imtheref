const express = require('express');
const partitaRouter = express.Router();
const isLoggedIn = require('../utils/passport');
const { PrismaClient } = require('@prisma/client');
const { partita } = require('../utils/db');
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
            userId: req.session.passport.user,
        }
    });
    res.json(partite);
});

partitaRouter.get('/visualizza/:id', isLoggedIn, async (req, res) => {
    const partite = await prisma.partita.findMany({
        where: {
            userId: req.session.passport.user,
            id: req.params.id
        }
    });
    res.json(partite);
});

partitaRouter.put('/modifica/:id', isLoggedIn, async (req, res) => {
    const { nome, data, categoria, rimborso, voto, incasso } = req.body;
    let parsedDate;
    if (data != undefined) {
        parsedDate = new Date(data); // Converte la stringa data in un oggetto Date
        if (parsedDate.toString() === 'Invalid Date') {
            return res.status(400).json({ error: 'Data non valida' });
        }
    }
    const partita = await prisma.partita.update({
        where: {
            id: req.params.id
        },
        data: {
            nome,
            data: parsedDate,
            categoria,
            rimborso,
            voto,
            incasso
        }
    });
    res.json(partita);
});

partitaRouter.delete('/elimina/:id', isLoggedIn, async (req, res) => {
    const partita = await prisma.partita.delete({
        where: {
            id: req.params.id
        }
    });
    res.json(partita);
    res.status(405).json({ error: 'Metodo non autorizzato' });
});


partitaRouter.use((req, res, next) => {
    res.status(405).json({ error: 'Metodo non autorizzato' });
});


module.exports = partitaRouter;