const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { ottieniCategoriaDaNome, creaCategoria } = require('./categoria');

async function ottieniPartitaDaTesto(testo) {
    let buff = new Buffer.from(testo, 'base64');
    let decripted = buff.toString('utf-8');



    const indexes = [
        "attivita",
        "comitato",
        "categoria",
        "descrizione_torneo",
        "girone",
        "giornata",
        "numero_gara",
        "gara",
        "data",
        "ora",
        "campo",
        "indirizzo",
        "localita",
        "provincia",
        "distanza",
        "rimborso"
    ]
    const righe = decripted.split("\n");

    const dati = {};
    for (let i = 0; i < righe.length; i++) {
        let campo = righe[i].split(":")[0].trim();
        let valore = righe[i].split(":")[1].trim();
        if (indexes[i] == "descrizione_torneo" && campo != "Descr. Torneo") {
            indexes.splice(i, 1);
        }
        if (indexes[i] == "ora") {
            dati[indexes[i]] = righe[i].split(":")[1].trim() + ":" + righe[i].split(":")[2].trim();
            continue;
        }
        if (indexes[i] == "rimborso") {
            dati[indexes[i]] = parseFloat(righe[i].split(":")[1].trim().replace(",", "."));
            continue;
        }
        dati[indexes[i]] = valore;
    }

    if (dati.categoria) {
        const categoria = await ottieniCategoriaDaNome(dati.categoria);
        if (categoria != null) {
            dati.categoria = categoria[0].id;
        }
        else {
            let nuovaCategoria = await creaCategoria(dati.categoria);
            dati.categoria = nuovaCategoria.id;
        }
    }


    if (dati.data) {
        dati.data = dati.data.split(" ")[1];
        let giorno = dati.data.split("/")[0];
        let mese = dati.data.split("/")[1];
        let anno = dati.data.split("/")[2];
        let ora = dati.ora.split(":")[0];
        let minuti = dati.ora.split(":")[1];
        dati.data = new Date(Date.UTC(anno, mese - 1, giorno, ora, minuti, 0, 0));
    }

    return dati;
}

async function creaPartita(req, dati) {
    try {
        const { gara, data, categoria, rimborso, incasso, voto } = dati;
        //console.log(dati);
        const partita = await prisma.partita.create({
            data: {
                gara: gara,
                data: data,
                categoria: {
                    connect: { id: categoria }
                },
                rimborso,
                incasso,
                voto,
                userId: req.session.passport.user
            }
        });
        return partita;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}


module.exports = {
    ottieniPartitaDaTesto,
    creaPartita
};
