import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import PaymentsIcon from '@mui/icons-material/Payments';
import SportsIcon from '@mui/icons-material/Sports';
import Groups3Icon from '@mui/icons-material/Groups3';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function TemporaryDrawer() {
    const [SidebarAperta, setSidebar] = React.useState(false);
    const [StatisticheAperta, setStatistiche] = React.useState(false);
    const [PartiteAperta, setPartite] = React.useState(false);

    const navigate = useNavigate();

    const toggleDrawer = (newOpen) => () => {
        setSidebar(newOpen);
    };

    const handleStatistiche = () => {
        setStatistiche(!StatisticheAperta);
    };

    const handlePartite = () => {
        setPartite(!PartiteAperta);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation">
            <List
                component="nav"
                aria-labelledby="subheader"
                subheader={
                    <ListSubheader component="div" id="subheader">
                        IMTHEREF
                    </ListSubheader>
                }
            >
                <ListItemButton onClick={() => navigate("/home")}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton onClick={handleStatistiche}>
                    <ListItemIcon>
                        <QueryStatsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Statistiche" />
                    {StatisticheAperta ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={StatisticheAperta} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }} onClick={() => navigate("/voti")}>
                            <ListItemIcon>
                                <ThumbsUpDownIcon />
                            </ListItemIcon>
                            <ListItemText primary="Voti" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }} onClick={() => navigate("/rimborsi")}>
                            <ListItemIcon>
                                <PaymentsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Rimborsi" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }} onClick={() => navigate("/categorie")}>
                            <ListItemIcon>
                                <Groups3Icon />
                            </ListItemIcon>
                            <ListItemText primary="Categorie" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={handlePartite}>
                    <ListItemIcon>
                        <SportsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Partite" />
                    {PartiteAperta ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={PartiteAperta} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }}>
                            <ListItemIcon>
                                <AddToPhotosIcon />
                            </ListItemIcon>
                            <ListItemText primary="Inserisci" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }}>
                            <ListItemIcon>
                                <ContentCopyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Inserisci da designazione" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 5 }}>
                            <ListItemIcon>
                                <MarkEmailReadIcon />
                            </ListItemIcon>
                            <ListItemText primary="Invia tramite email" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
            <Divider />
            <Divider />
            <List sx={{
                width: 250,
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                bottom: 0
            }}>
                <ListItem key="Logout" disablePadding>
                    <ListItemButton onClick={() => navigate("/logout")}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}><MenuIcon /></Button>
            <Drawer open={SidebarAperta} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}