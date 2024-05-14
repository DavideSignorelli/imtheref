import Tabella from "../components/tabella";
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useState, useEffect } from 'react';

async function getDati() {
    if (window.location.pathname === "/home") {
        const response = await fetch("/api/partita/visualizza", {
            credentials: "include"
        });
        return await response.json();
    }
}

function home() {
    const [dati, setDati] = useState([]);
    const [totaleIncassi, setTotaleIncassi] = useState(0);
    const [incassato, setIncassato] = useState(0);
    const [daIncassare, setDaIncassare] = useState(0);

    useEffect(() => {
        getDati().then((dati) => {
            setDati(dati);
        });
    }, []);

    useEffect(() => {
        let totale = 0;
        let incassato = 0;
        dati.forEach((partita) => {
            totale += partita.rimborso;
            partita.incasso == true ? incassato += partita.rimborso : null;
        });
        setTotaleIncassi(totale);
        setIncassato(incassato);
        setDaIncassare(totale - incassato);
    }, [dati]);

    return (
        <div>
            <Sheet
                sx={{
                    width: "70%",
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}
            >
                <Typography level="h1" component="h1" textAlign={"center"}>
                    IMTHEREF
                </Typography>
                <Tabella />
                <Typography level="h4" component="h4" textAlign={"left"}>
                    Totale rimborsato: {totaleIncassi}€
                </Typography>
                <Typography level="h4" component="h4" textAlign={"left"}>
                    Rimborsi incassati: {incassato}€
                </Typography>
                <Typography level="h4" component="h4" textAlign={"left"}>
                    Rimborsi da incassare: {daIncassare}€
                </Typography>
            </Sheet>
        </div>
    );
}

export default home;