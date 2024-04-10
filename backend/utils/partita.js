module.exports = function ottieniPartitaDaTesto(testo) {
    let buff = new Buffer(testo, 'base64');
    let decripted = buff.toString('ascii');

    const regexps = {
        attivita: /Attività\s*:\s*(.*)/,
        comitato: /Comitato\/Delegazione\s*:\s*(.*)/,
        categoria: /Categoria\s*:\s*(.*)/,
        girone: /Girone\s*:\s*(.*)/,
        giornata: /Giornata\s*:\s*(.*)/,
        numeroGara: /Numero\s*Gara\s*:\s*(.*)/,
        gara: /Gara\s*:\s*(.*)/,
        data: /Data\s*:\s*(.*)/,
        ora: /Ora\s*:\s*(.*)/,
        campo: /Campo\s*:\s*(.*)/,
        indirizzo: /Indirizzo\s*:\s*(.*)/,
        localita: /Località\s*:\s*(.*)/,
        provincia: /Provincia\s*:\s*(.*)/,
        distanza: /Distanza\s*\(km\)\s*:\s*(.*)/,
        rimborso: /Rimborso\s*Totale\s*\(€\)\s*:\s*(.*)/,
    };

    let giorno;
    let mese;
    let anno;
    let ora;
    let minuto;

    const dati = {};
    Object.entries(regexps).forEach(([campo, regex]) => {
        const match = regex.exec(decripted);
        if (match) {
            if (campo === "data") {
                // Escludi il giorno della settimana dalla data
                const dataSenzaGiorno = match[1].replace(/[^0-9\/]/g, "").trim();
                dati[campo] = dataSenzaGiorno;
                dataSenzaGiorno.split("/").forEach((element, index) => {
                    if (index === 0) {
                        giorno = element;
                    } else if (index === 1) {
                        mese = element;
                    } else {
                        anno = element;
                    }
                });
            } else {
                dati[campo] = match[1].trim();
            }
            if (campo === "ora") {
                ora = dati[campo].split(":")[0];
                minuto = dati[campo].split(":")[1];
                dati["data"] = new Date(anno, mese - 1, giorno, ora, minuto, 0, 0);
                if (dati["data"].toString() === "Invalid Date") {
                    dati["data"] = "seeeee";
                }
            }
        }
    });
    console.log(dati);
    return dati;
}
