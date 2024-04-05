const express = require('express');
const categoriaRouter = express.Router();
const isLoggedIn = require('../utils/passport');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

categoriaRouter.post('/crea', isLoggedIn, async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ error: 'Nome obbligatorio' });
        }
        const categoria = await prisma.categoria.create({
            data: {
                nome
            }
        });
        res.json(categoria);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore interno' + error });
    }
});

categoriaRouter.get('/visualizza', isLoggedIn, async (req, res) => {
    try {
        const categorie = await prisma.categoria.findMany();
        res.json(categorie);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore interno' + error });
    }
});

categoriaRouter.get('/visualizza/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        if (ObjectId.isValid(id) === false)
            return res.status(400).json({ error: 'Id non valido' });
        const categoria = await prisma.categoria.findUnique({
            where: {
                id
            }
        });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria non trovata' });
        }
        res.json(categoria);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore interno' + error });
    }
});

module.exports = categoriaRouter;