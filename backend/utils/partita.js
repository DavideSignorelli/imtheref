const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { ottieniCategoriaDaNome, creaCategoria } = require('./categoria');

async function ottieniPartitaDaTesto(testo) {
    let buff = new Buffer.from(testo, 'base64');
    let decripted = buff.toString('ascii');

    const indexes = [
        "attività",
        "comitato",
        "categoria",
        "girone",
        "giornata",
        "numero gara",
        "gara",
        "data",
        "ora",
        "campo",
        "indirizzo",
        "località",
        "provincia",
        "distanza",
        "rimborso"
    ]
    const righe = decripted.split("\n");

    const dati = {};
    for (let i = 0; i < righe.length; i++) {
        if (indexes[i] == "ora") {
            dati[indexes[i]] = righe[i].split(":")[1].trim() + ":" + righe[i].split(":")[2].trim();
            continue;
        }
        if (indexes[i] == "rimborso") {
            dati[indexes[i]] = parseFloat(righe[i].split(":")[1].trim().replace(",", "."));
            continue;
        }
        dati[indexes[i]] = righe[i].split(":")[1].trim();
    }

    if (dati.categoria) {
        const categoria = await ottieniCategoriaDaNome(dati.categoria);
        //console.log(categoria);
        if (categoria.length > 0) {
            //console.log("esiste");
            dati.categoria = categoria[0].id;
            //console.log(dati.categoria, categoria);
        }
        else {
            //console.log("non esiste");
            creaCategoria(dati.categoria).then((categoria) => {
                dati.categoria = categoria.id;
            }).catch((error) => {
                console.log(error);
            });
        }
    }


    //console.log(dati);
    if (dati.data) {
        dati.data = dati.data.split(" ")[1];
        dati.data = new Date(dati.data.split("/")[2], dati.data.split("/")[1], dati.data.split("/")[0], dati.ora.split(":")[0], dati.ora.split(":")[1]);
    }

    //console.log(dati);
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
