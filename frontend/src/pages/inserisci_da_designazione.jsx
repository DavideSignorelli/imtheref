import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { encode } from 'base-64';
import { Buffer } from 'buffer';


export default function InserisciDaDesignazione() {
    const navigate = useNavigate();
    const [designazione, setDesignazione] = useState('');

    async function inserisci() {
        if (designazione === '') {
            alert("Inserisci la designazione");
            return;
        }
        let buff = new Buffer.from(designazione, 'utf-8');
        let encripted = buff.toString('base64');
        const response = await fetch("/api/partita/creaDaTesto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                testo: encripted
            })
        });

        if (response.ok) {
            alert("Inserimento avvenuto con successo");
            navigate("/home");

        } else {
            alert("Errore nell'inserimento");
        }
    }

    return (
        <form action="">
            <Sheet
                sx={{
                    width: "60%",
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
                <Typography level="h4" component="h1">
                    Inserisci la gara
                </Typography>
                <FormControl>
                    <Textarea
                        minRows={7}
                        placeholder="Incolla la tua designazione"
                        size="lg"
                        onChange={(e) => setDesignazione(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Button
                        sx={{ mt: 2 /* margin top */ }}
                        onClick={inserisci}
                    >
                        Inserisci
                    </Button>
                </FormControl>
            </Sheet >
        </form>
    );
}
