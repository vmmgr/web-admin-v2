import React from 'react';
import {
    Badge, Collapse,
    Container, ThemeProvider,
    CssBaseline,
    Divider,
    IconButton,
    List, ListItem, ListItemIcon, ListItemText,
    Toolbar,
    Typography,
    MenuItem, Menu, Fade, Box, styled,
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import ClassIcon from '@mui/icons-material/Class';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ComputerIcon from '@mui/icons-material/Computer';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import {useHistory} from "react-router-dom";
import {Logout} from "../../api/Auth";
import {colorTheme} from "../Theme";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

export default function Dashboard(props: any) {
    // Menu Bar
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpenOther(false);
        setOpen(false);
    };
    // Menu Bar (Other Button)
    const [openOther, setOpenOther] = React.useState(false);
    const handleClick = () => {
        setOpenOther(!openOther);
        // Menu Bar is not opened...
        if (!open) {
            setOpen(true);
        }
    };

    const history = useHistory();

    const DashboardPage = () => {
        history.push("/dashboard");
    }
    const NoticePage = () => {
        history.push("/dashboard/notice");
    }
    const GroupPage = () => {
        history.push("/dashboard/group");
    }
    const NodePage = () => {
        history.push("/dashboard/node");
    }
    const VMPage = () => {
        history.push("/dashboard/vm");
    }
    const OrderPage = () => {
        history.push("/dashboard/order");
    }
    const SupportPage = () => {
        history.push("/dashboard/support");
    }
    const ServicePage = () => {
        history.push("/dashboard/service");
    }
    const ConnectionPage = () => {
        history.push("/dashboard/connection");
    }
    const UserPage = () => {
        history.push("/dashboard/user");
    }
    const TokenPage = () => {
        history.push("/dashboard/token");
    }

    return (
        <ThemeProvider theme={colorTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{
                        pr: '24px',
                    }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
                            vmmgr Admin Page
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <UserMenu key={"user_menu"}/>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <ListItem button onClick={DashboardPage}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    {/*<ListItem button onClick={NoticePage}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <NotificationsIcon/>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Notice"/>*/}
                    {/*</ListItem>*/}
                    <ListItem button onClick={GroupPage}>
                        <ListItemIcon>
                            <PeopleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Group"/>
                    </ListItem>
                    <ListItem button onClick={NodePage}>
                        <ListItemIcon>
                            <ComputerIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Node"/>
                    </ListItem>
                    <ListItem button onClick={VMPage}>
                        <ListItemIcon>
                            <ViewAgendaIcon/>
                        </ListItemIcon>
                        <ListItemText primary="VM"/>
                    </ListItem>
                    {/*<ListItem button onClick={OrderPage}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <ShoppingCartIcon/>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Orders"/>*/}
                    {/*</ListItem>*/}
                    {/*<ListItem button onClick={SupportPage}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <ChatIcon/>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Chat"/>*/}
                    {/*</ListItem>*/}
                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <LayersIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Other"/>
                        {openOther ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openOther} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button={true} onClick={UserPage} sx={{
                                marginLeft: 2,
                                marginRight: -2
                            }}>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary="User"/>
                            </ListItem>
                            <ListItem button={true} onClick={TokenPage} sx={{
                                marginLeft: 2,
                                marginRight: -2
                            }}>
                                <ListItemIcon>
                                    <VpnKeyIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Token"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button>
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Setting"/>
                    </ListItem>
                    <Divider/>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="inherit"
                            noWrap
                            sx={{
                                marginBottom: 1
                            }}
                        >
                            {props.title}
                        </Typography>
                        {props.children}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export function UserMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const history = useHistory();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const clickLogout = () => {
        Logout().then(res => {
                sessionStorage.removeItem('ACCESS_TOKEN');
                history.push('/login');
                console.log(res)
                if (res === "") {
                } else {

                }
            }
        );
    }

    return (
        <Box>
            <IconButton
                color="inherit"
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <PermIdentityIcon/>
            </IconButton>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                <MenuItem onClick={clickLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}
