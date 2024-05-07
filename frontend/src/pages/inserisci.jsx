import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Checkbox from '@mui/joy/Checkbox';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';


async function getCategorie() {
    const response = await fetch("/api/categoria/visualizza", {
        credentials: "include"
    });
    return await response.json();
}





export default function Inserisci() {
    const [categorie, setCategorie] = useState([]);
    React.useEffect(() => {
        getCategorie().then((data) => setCategorie(data));
    }, []);

    const navigate = useNavigate();
    const stileInput = {
        mt: 1
    }
    const [values, setValues] = useState({
        gara: '',
        data: '',
        ora: '',
        categoria: '',
        rimborso: 0,
        incasso: false,
        voto: 0,
    });

    async function inserisci() {
        //conrollo se i campi sono stati compilati
        const categoria = document.getElementById("categoria").innerHTML;
        if (values.gara === '' || values.data === '' || values.ora === '' || categoria === '' || values.rimborso === 0) {
            alert("Compila tutti i campi");
            console.log(values);
            return;
        }
        const response = await fetch("/api/partita/crea", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    gara: values.gara,
                    data: values.data,
                    categoria: categoria,
                    rimborso: parseFloat(values.rimborso),
                    incasso: values.incasso,
                    voto: parseFloat(values.voto)
                }
            )
        });
        if (response.status === 200) {
            alert("Inserimento avvenuto con successo");
            navigate("/home");
        }
        else {
            alert("Errore");
        }
    }

    const handleChange = (prop) => (event) => {
        const value = prop === 'incasso' ? event.target.checked : event.target.value;
        setValues({ ...values, [prop]: value });
    };


    return (
        <form action="">
            <Sheet
                sx={{
                    width: 300,
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
                    <FormLabel>Gara</FormLabel>
                    <Input
                        name="gara"
                        type="text"
                        placeholder="SOCIETÀ 1 - SOCIETÀ 2"
                        sx={stileInput}
                        onChange={handleChange('gara')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Data</FormLabel>
                    <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
                        <Input
                            name="gara"
                            type="date"
                            onChange={handleChange('data')}
                        />
                        <Divider orientation="vertical" />
                        <Input
                            name="gara"
                            type="time"
                            onChange={handleChange('ora')}
                        />
                    </Box>
                </FormControl>
                <FormControl>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                        placeholder="Categoria"
                        sx={stileInput}
                        id="categoria"
                    >
                        {categorie.map((categoria) => (
                            <Option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </Option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Voto</FormLabel>
                    <Input
                        name="voto"
                        type="number"
                        placeholder="8.60"
                        sx={stileInput}
                        onChange={handleChange('voto')}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Rimborso (€)</FormLabel>
                    <Input
                        name="rimborso"
                        type="number"
                        placeholder="44"
                        sx={stileInput}
                        onChange={handleChange('rimborso')}
                    />
                </FormControl>
                <FormControl>
                    <Checkbox
                        label={"È già stata incassata?"}
                        sx={stileInput}
                        onChange={handleChange('incasso')}
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
