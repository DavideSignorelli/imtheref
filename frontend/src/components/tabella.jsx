import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import { alpha } from '@mui/material/styles';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import '../styles/loader.css';

async function getDati() {
    if (window.location.pathname === "/home") {
        const response = await fetch("/api/partita/visualizza", {
            credentials: "include"
        });
        return await response.json();
    }
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => ascendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'categoria') {
        return b[orderBy].nome.localeCompare(a[orderBy].nome);
    }
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function ascendingComparator(a, b, orderBy) {
    if (orderBy === 'categoria') {
        return a[orderBy].nome.localeCompare(b[orderBy].nome);
    }
    if (a[orderBy] < b[orderBy]) {
        return -1;
    }
    if (a[orderBy] > b[orderBy]) {
        return 1;
    }
    return 0;
}


function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'gara',
        numeric: false,
        disablePadding: false,
        label: 'Gara',
    },
    {
        id: 'data',
        numeric: true,
        disablePadding: false,
        label: 'Data',
    },
    {
        id: 'categoria',
        numeric: false,
        disablePadding: false,
        label: 'Categoria',
    },
    {
        id: 'voto',
        numeric: true,
        disablePadding: false,
        label: 'Voto',
    },
    {
        id: 'rimborso',
        numeric: true,
        disablePadding: false,
        label: 'Rimborso',
    },
    {
        id: 'incasso',
        numeric: true,
        disablePadding: false,
        label: 'Incasso',
    },
];

async function eliminaPartita(id) {
    const response = await fetch(`/api/partita/elimina/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    return response.status;
}



async function elimina(ids) {
    for (let id of ids) {
        if (await eliminaPartita(id) == 200) {
            console.log("Partita eliminata");
        } else {
            alert("Errore durante l'eliminazione della partita");
            return;
        }
    }
    alert("Eliminazione avvenuta con successo");
    window.location.reload();
}



function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'seleziona tutte le partite',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={
                            headCell.id == "gara" || headCell.id == "rimborso" ? headCell.id == "gara" ? "left" : "right" : 'center'
                        }
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { selected } = props;
    const numSelected = selected.length;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Partite arbitrate
                </Typography>
            )}

            {numSelected == 1 && (
                <Tooltip title="Modifica">
                    <Button><ModeIcon /></Button>
                </Tooltip>
            )}

            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <Button onClick={() => elimina(selected)}><DeleteIcon /></Button>
                </Tooltip>
            )}
        </Toolbar>
    );
}


export default function Tabella() {
    const [rows, setRows] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [ids, setIds] = useState([]);
    const [open, setOpen] = useState(false);


    React.useEffect(() => {
        getDati().then((data) => {
            setRows(data);
            setDataLoaded(true);
        });
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('data');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    async function modificaIncasso(event, id) {
        setOpen(true);
        const response = await fetch(`/api/partita/modificaIncasso/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                incasso: event.target.checked,
                partita: id
            })
        });
        if (response.status != 200) {
            alert('Errore, riprova più tardi');
            return;
        }
        getDati().then((data) => {
            setRows(data);
            setDataLoaded(true);
        });
        setOpen(false);
        //window.location.reload();
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        if (event.target.type === 'checkbox') {
            return;
        }
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setIds(ids.concat(newSelected));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [rows, order, orderBy, page, rowsPerPage],
    );

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4,
    };




    return (

        <Box sx={{ width: '100%' }}>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='loader' />
                </Box>
            </Modal>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar selected={selected} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {
                                visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align='left'
                                            >
                                                {row.gara}
                                            </TableCell>
                                            <TableCell align="right">{row.data
                                                .replace('Z', '')
                                                .replace('T', ' ')
                                                .replace(':00.000', '')
                                                .replace('-', '/')
                                                .replace('-', '/')}</TableCell>
                                            <TableCell align="center">{row.categoria.nome}</TableCell>
                                            <TableCell align="center">{row.voto}</TableCell>
                                            <TableCell align="right">{row.rimborso}</TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={row.incasso}
                                                    onClick={(event) => {
                                                        modificaIncasso(event, row.id)
                                                    }}
                                                    id={"ch" + row.id}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, rows.length != 5 && rows.length != 10 && rows.length != 25 ? rows.length : null]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>

    );
}
