import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




async function getDati() {
    const response = await fetch("/api/partita/visualizza", {
        credentials: "include"
    });
    return await response.json();
}

const rows = await getDati();


export default function Tabella() {
    return (


        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Gara</TableCell>
                        <TableCell align="center">Data</TableCell>
                        <TableCell align="center">Categoria</TableCell>
                        <TableCell align="center">Voto</TableCell>
                        <TableCell align="center">Rimborso&nbsp;(€)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.gara}
                            </TableCell>
                            <TableCell align="center">
                                {
                                    row.data
                                        .replace('Z', '')
                                        .replace('T', ' ')
                                        .replace(':00.000', '')
                                        .replace('-', '/')
                                        .replace('-', '/')
                                }
                            </TableCell>
                            <TableCell align="center">{row.categoria.nome}</TableCell>
                            <TableCell align="center">{row.voto}</TableCell>
                            <TableCell align="center">{row.rimborso}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}
