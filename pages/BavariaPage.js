import React, { useState, useEffect } from "react";
import "../styles/BavariaPage.css";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { red } from "@mui/material/colors";
import {
    AppBar,
    Avatar,
    IconButton,
    Drawer,
    Box,
    Stack,
    Typography,
    TableContainer,
    TableRow,
    TableCell, Paper,
    CircularProgress,
    Popover,
    Badge,
    List,
    Divider
}
    from "@mui/material";
import { Notifications, Logout, MoreVert, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import useBavaria from "../hooks/useBavaria";

function BavariaPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { entities } = useBavaria();
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [completedDrugs, setCompletedDrugs] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

    useEffect(() => {
        const getDrugs = async () => {
            setLoading(true); // set loading state to true
            const drugEntities = await entities.drug.list();
            const drugData = drugEntities.items.map((drug) => ({
                _id: drug._id,
                name: drug.name,
                dateOrdered: drug.dateOrdered,
                totalVials: drug.totalVials,
                dateCompleted: drug.dateCompleted,
                placebo: drug.placebo,
                batchNumber: drug.batchNumber,
                id: drug.id,
                trialPatients: drug.trialPatients,
                drugIDs: drug.drugIDs,
                released: drug.released,
            }));
            setDrugs(drugData);
            setLoading(false); // set loading state to false
            console.log(drugData);
            const newCompletedDrugs = drugData.filter((drug) => drug.dateCompleted !== null && drug.dateCompleted !== undefined);
            setCompletedDrugs(newCompletedDrugs);
        };
        getDrugs();
    }, [entities.drug]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleNotificationClick = () => {
        setNotificationOpen(true);
    };

    const handleNotificationClose = () => {
        setNotificationOpen(false);
    };

    return (
        <>
            <div>
                <AppBar color="inherit" position="static">
                    <ToolBar>
                        <>
                            <IconButton onClick={() => setIsDrawerOpen(true)}>
                                <Menu sx={{ fontSize: '1.75rem' }} />
                            </IconButton>
                            <Drawer
                                anchor='left'
                                open={isDrawerOpen}
                                onClose={() => setIsDrawerOpen(false)}
                            >
                                <Box p={2} width='200px' textAlign='center' role='presentation'>
                                    <Stack>
                                        <Typography variant="h5">
                                            NAVIGATION
                                        </Typography>
                                        <Button variant="string" href="/">
                                            Jane Hopkins
                                        </Button>
                                        <Button variant="string" href="/">
                                            FDA
                                        </Button>
                                    </Stack>
                                </Box>
                            </Drawer>
                        </>

                        <Typography variant="h5" component='div' sx={{ flexGrow: 1 }}>
                            BAVARIA
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <div className="profile">
                                <Badge badgeContent={completedDrugs.length} color="primary" sx={{ marginTop: '0.5rem', marginRight: '1rem' }} onClick={handleNotificationClick}>
                                    <Notifications />
                                </Badge>
                            </div>
                            <Popover
                                open={notificationOpen}
                                onClose={handleNotificationClose}
                                anchorEl={notificationOpen ? document.querySelector('#notification-button') : null}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    marginTop: '2.5rem',
                                    marginRight: '4rem',
                                    marginLeft: '-1.5rem',
                                }}
                            >
                                <List>
                                    <Box sx={{ p: 2, borderBottom: '3px solid rgba(0, 0, 0, 0.2)' }}>
                                        <Typography variant="subtitle1" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>Notifications</Typography>
                                    </Box>
                                    {(completedDrugs.length > 0) ? (
                                        completedDrugs.map((drug, index) => (
                                            <React.Fragment key={drug._id}>
                                                {!drug.released ? (
                                                    <Link to={'/bavariapage/drug/' + drug._id} style={{ textDecoration: 'none' }}>
                                                        <Box
                                                            className="notificationDrug"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                borderLeft: '5px solid rgb(173, 216, 230)',
                                                                bgcolor: 'grey.100',
                                                                p: 2,
                                                                mb: index !== completedDrugs.length - 1 ? 1 : 0, width: '320px'
                                                            }}>
                                                            <Typography sx={{ flexGrow: 1, fontSize: '1rem' }}>Trial {drug.name} has been completed.</Typography>
                                                            <IconButton aria-label="options" size="small">
                                                                <MoreVert />
                                                            </IconButton>
                                                        </Box>
                                                    </Link>

                                                ) : (
                                                    <Link to={'/bavariapage/drug/' + drug._id} style={{ textDecoration: 'none' }}>
                                                        <Box
                                                            className="notificationDrug"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                borderLeft: '5px solid rgb(0, 216, 0)',
                                                                bgcolor: 'grey.100',
                                                                p: 2,
                                                                mb: index !== completedDrugs.length - 1 ? 1 : 0, width: '320px'
                                                            }}>
                                                            <Typography sx={{ flexGrow: 1, fontSize: '1rem' }}>Trial {drug.name} has been released.</Typography>
                                                            <IconButton aria-label="options" size="small">
                                                                <MoreVert />
                                                            </IconButton>
                                                        </Box>
                                                    </Link>
                                                )}
                                                {index !== completedDrugs.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 2, width: '320px' }}>
                                            No New Notifications
                                        </Box>
                                    )}
                                </List>
                            </Popover>
                            <div></div>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <div className="profile"><Avatar sx={{ bgcolor: red[900] }} onClick={handleClick}>B</Avatar></div>
                        </Stack>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Box>
                                <Box display="flex" alignItems="center" p={3}>
                                    <Avatar sx={{ bgcolor: red[900] }}>B</Avatar>
                                    <Box ml={1}>
                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Logged in as Bavaria
                                        </Typography>
                                        <Typography variant="body2">{user?.email} <span style={{ fontSize: '0.7rem' }}> (Admin)</span></Typography>
                                    </Box>
                                </Box>
                                <div className="submenu"><Box bgcolor="rgba(0,0,0,0.1)" p={2} flexGrow={1} borderTop="1px solid rgba(0, 0, 0, 0.2)">
                                    Settings
                                </Box></div>
                                <div className="submenu"><Box bgcolor="rgba(0,0,0,0.1)" p={2} flexGrow={1} borderTop="1px solid rgba(0, 0, 0, 0.2)" onClick={handleLogout}>
                                    Log Out<Logout sx={{ fontSize: '1rem', marginLeft: '0.5rem' }} />
                                </Box></div>
                            </Box>
                        </Popover>
                    </ToolBar>
                </AppBar>
            </div>

            <div className="BavariaPage">

            </div>

            <div className="BavariaPage-body">
                <Paper>
                    <Stack direction="row" justifyContent="space-between" sx={{ marginRight: '8px', marginLeft: '8px', paddingBottom: '1rem', paddingTop: '1rem' }}>
                        <Box
                            border={1}
                            p={1}
                            sx={{
                                backgroundColor: '#c23734',
                                borderRadius: 1,
                                p: 1,
                                marginRight: 3,
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'white' }}>
                                Shipment Request:
                            </Typography>
                        </Box>
                        <Button variant="contained" color="primary" sx={{ backgroundColor: 'red' }} href={"/bavariapage/adddrug"}>
                            +
                        </Button>
                    </Stack>
                </Paper>
                <>
                    <Paper>
                        <TableContainer sx={{ maxHeight: '500px' }}>
                            {drugs
                                .filter((drug) => (!drug.dateCompleted && !drug.trialPatients))
                                .sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered))
                                .map((drug) => (
                                    <TableRow key={drug.id}>
                                        <TableCell>
                                            <Link to={"/bavariapage/drug/" + drug._id}>
                                                <Box
                                                    className="drugInformation"
                                                    border={1}
                                                    p={1}
                                                    sx={{
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: 1,
                                                        p: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '89.4vw'
                                                    }}
                                                >
                                                    <Box sx={{ borderColor: 'black' }}>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Trial Name:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Date Order Placed:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.dateOrdered}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Total Vials Ordered:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.totalVials}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableContainer>
                    </Paper>

                </>
            </div>

            <div className="BavariaPage-body">
                <Paper>
                    <TableContainer sx={{ maxHeight: '500px' }}>
                        <TableRow>
                            <TableCell><Box
                                border={1}
                                p={1}
                                sx={{
                                    backgroundColor: '#c23734',
                                    borderRadius: 1,
                                    p: 1,
                                }}
                            >
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Ongoing Trial:
                                </Typography>
                            </Box></TableCell>
                        </TableRow>
                    </TableContainer>
                </Paper>
                <>
                    <Paper>
                        <TableContainer sx={{ maxHeight: '500px' }}>
                            {drugs
                                .filter((drug) => (!drug.dateCompleted && drug.trialPatients))
                                .sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered))
                                .map((drug) => (
                                    <TableRow key={drug.id}>
                                        <TableCell>
                                            <Link to={"/bavariapage/drug/" + drug._id}>
                                                <Box
                                                    className="drugInformation"
                                                    border={1}
                                                    p={1}
                                                    sx={{
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: 1,
                                                        p: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '89.4vw'
                                                    }}
                                                >
                                                    <Box sx={{ borderColor: 'black' }}>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Trial Name:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Date Order Placed:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.dateOrdered}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                                                            Total Vials Ordered:
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                                                            {drug.totalVials}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableContainer>

                    </Paper>

                </>
            </div>

            <div className="BavariaPage-body">
                <Paper>
                    <TableContainer sx={{ maxHeight: '500px' }}>
                        <TableRow>
                            <TableCell><Box
                                border={1}
                                p={1}
                                sx={{
                                    backgroundColor: '#c23734',
                                    borderRadius: 1,
                                    p: 1,
                                }}
                            >
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Post Trial Results:
                                </Typography>
                            </Box></TableCell>
                        </TableRow>
                    </TableContainer>
                </Paper>
                <>
                    <Paper>
                        <TableContainer sx={{ maxHeight: '500px' }}>
                            {drugs
                                .filter((drug) => (drug.dateCompleted && drug.trialPatients))
                                .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted))
                                .map((drug) => (
                                    <TableRow key={drug.id}>
                                        <Link to={"/bavariapage/drug/" + drug._id}>
                                            <TableCell>
                                                <Box
                                                    className="drugInformation"
                                                    border={1}
                                                    p={1}
                                                    sx={{
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: 1,
                                                        p: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '89.4vw'
                                                    }}
                                                >
                                                    <Box sx={{ borderColor: "black" }}>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                            Trial Name:
                                                        </Typography>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                            {drug.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                            Trial Completion Data:
                                                        </Typography>
                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                            {drug.dateCompleted}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </Link>
                                    </TableRow>
                                ))}
                        </TableContainer>
                    </Paper>
                </>
            </div>
            {loading && <div className="LoadingOverlay">
                <CircularProgress />
            </div>}
        </>
    );
}
export default BavariaPage;
