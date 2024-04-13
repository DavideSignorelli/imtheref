const express = require('express');
const partitaRouter = express.Router();
const isLoggedIn = require('../utils/passport');
const { ottieniPartitaDaTesto, creaPartita } = require('../utils/partita');
const { PrismaClient, Prisma } = require('@prisma/client');
//const { partita } = require('../utils/db');


const prisma = new PrismaClient();
var ObjectId = require('mongoose').Types.ObjectId;


partitaRouter.post('/crea', isLoggedIn, async (req, res) => {
    try {
        const { gara, data, categoria, rimborso, voto, incasso } = req.body;
        if (!gara || !data || !categoria || !rimborso) {
            return res.status(400).json({ error: 'gara, data, categoria e rimborso sono obbligatori' });
        }
        //console.log(data);
        const parsedDate = new Date(data); // Converte la stringa data in un oggetto Date
        if (parsedDate.toString() === 'Invalid Date') {
            return res.status(400).json({ error: 'Data non valida' });
        }

        const dati = {
            gara,
            data: parsedDate,
            categoria,
            rimborso,
            incasso,
            voto
        };

        const partita = await creaPartita(req, dati);
        res.json(partita);
    }
    catch (error) {
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});

partitaRouter.post('/creaDaTesto', isLoggedIn, async (req, res) => {
    try {
        const { testo } = req.body;
        if (!testo) {
            return res.status(400).json({ error: 'Testo mancante' });
        }
        const dati = await ottieniPartitaDaTesto(testo);
        if (Object.keys(dati).length === 0) {
            return res.status(400).json({ error: 'Testo non valido' });
        }
        const { gara, data, categoria, rimborso } = dati;
        if (!gara || !data || !categoria || !rimborso) {
            return res.status(400).json({ error: 'Nome, data, categoria e rimborso sono obbligatori' });
        }
        if (data.toString() === 'Invalid Date') {
            return res.status(400).json({ error: 'Data non valida' });
        }
        const partita = await creaPartita(req, dati);
        res.json(partita);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});

partitaRouter.get('/visualizza', isLoggedIn, async (req, res) => {
    try {
        const partite = await prisma.partita.findMany({
            where: {
                userId: req.session.passport.user,
            },
            orderBy: {
                data: 'asc'
            },
            include: {
                categoria: true,
            }
        });
        res.json(partite);
    }
    catch (error) {
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});

partitaRouter.get('/visualizza/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        if (ObjectId.isValid(id) === false)
            return res.status(400).json({ error: 'Id non valido' });
        const partite = await prisma.partita.findMany({
            where: {
                userId: req.session.passport.user,
                id: req.params.id
            },
            include: {
                categoria: true,
            }
        });
        if (partite.length === 0) {
            return res.status(404).json({ error: 'Partita non trovata' });
        }
        res.json(partite);
    }
    catch (error) {
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});

partitaRouter.put('/modifica/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        if (ObjectId.isValid(id) === false)
            return res.status(400).json({ error: 'Id non valido' });
        let gara = await prisma.partita.findMany({
            where: {
                id,
                userId: req.session.passport.user
            }
        });
        if (gara.length === 0) {
            return res.status(404).json({ error: 'Partita non trovata' });
        }
        const { nome, data, categoria, rimborso, voto, incasso } = req.body;
        const parsedDate = new Date(data);
        if (data != undefined) {
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
                categoria: {
                    connect: { id: categoria }
                },
                rimborso,
                voto,
                incasso
            }
        });
        res.json(partita);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});

partitaRouter.delete('/elimina/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        if (ObjectId.isValid(id) === false)
            return res.status(400).json({ error: 'Id non valido' });
        const partita = await prisma.partita.delete({
            where: {
                id: req.params.id
            }
        });
        res.json(partita);
    }
    catch (error) {
        return res.status(500).json({ error: 'Errore interno' + error });
    }
});


partitaRouter.use((req, res, next) => {
    return res.status(405).json({ error: 'Metodo non autorizzato' });
});


module.exports = partitaRouter;