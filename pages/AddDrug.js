import {
    AppBar,
    Breadcrumbs,
    Avatar,
    IconButton,
    Drawer,
    Box,
    Stack,
    Paper,
    Typography, Link,
    CircularProgress,
    Popover
}
    from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Menu } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { red } from "@mui/material/colors";
import "../styles/BavariaPage.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useBavaria from "../hooks/useBavaria";

const AddDrug = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { entities } = useBavaria();
    const [drug, setDrug] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [name, setName] = useState('');
    const [dateOrdered, setDateOrdered] = useState('');
    const [totalVials, setTotalVials] = useState('');
    const [placebo, setPlacebo] = useState(false);
    const [batchNumber, setBatchNumber] = useState('');
    const [id, setId] = useState('');

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function generateDrugIds(totalVials) {
        const drugIDs = [];
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 0; i < totalVials; i++) {
            let id = '';
            do {
                id = characters.charAt(Math.floor(Math.random() * characters.length));
                for (let j = 0; j < 3; j++) {
                    id += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                for (let j = 0; j < 3; j++) {
                    id += characters.charAt(Math.floor(Math.random() * characters.length));
                }
            } while (drugIDs.includes(id)); // check if ID already exists in array
            drugIDs.push({ ids: id });
        }

        return drugIDs;
    }

    const addDrug = async (drugACL) => {
        setLoading(true);
        const drugIDs = generateDrugIds(totalVials);
        const newDrug = {
            name,
            dateOrdered,
            totalVials,
            placebo,
            batchNumber,
            id,
            drugIDs: drugIDs,
            released: false,
        };

        drugACL = {
            acl: [
                {
                    principals: {
                        nodes: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "name",
                },
                {
                    principals: {
                        node: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "dateOrdered"
                },
                {
                    principals: {
                        node: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "totalVials"
                },
                {
                    principals: {
                        node: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "dateCompleted"
                },
                {
                    principals: {
                        node: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "placebo"
                },
                {
                    principals: {
                        node: ["FDA"]
                    },
                    operations: ["READ"],
                    path: "id"
                },
                {
                    principals: {
                        nodes: ["FDA"]
                    },
                    operations: ["READ", "WRITE"],
                    path: "trialPatients",
                },
            ]
        };

        const addDrugResponse = await entities.drug.add(newDrug, drugACL);
        console.log(addDrugResponse);
        setLoading(false);
        setDrug([...drug, newDrug]);
        setName('');
        setDateOrdered('');
        setTotalVials('');
        setPlacebo(false);
        setBatchNumber('');
        setId('');
        navigate('/bavariapage');
    };

    const handleName = (event) => {
        setName(event.target.value);
    };
    const handleDateOrdered = (event) => {
        setDateOrdered(event.target.value);
    };
    const handleTotalVials = (event) => {
        setTotalVials(event.target.value);
    };
    const handlePlacebo = (event) => {
        setPlacebo(event.target.checked);
    };
    const handleBatchNumber = (event) => {
        setBatchNumber(event.target.value);
    };
    const handleId = (event) => {
        setId(event.target.value);
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

            <div className="breadcrumb">
                <Box m={2}>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Link underline="hover" href='/bavariapage'>Home</Link>
                        <Link underline="hover" href={"/bavariapage/adddrug"}>Add Drug</Link>
                    </Breadcrumbs>
                </Box>
            </div>

            <div className="drug">
                <div className="something">
                    <div className="drug-container">
                        <span style={{ marginRight: '8px', paddingBottom: '1rem', textAlign: 'center' }}>Add Drug
                        </span>
                        <Paper className="drug-top">
                            <Stack direction="row" alignItems="center">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Name: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="Name"
                                                value={name}
                                                onChange={handleName}
                                            /></span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Date Ordered: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="MM/DD/YYYY"
                                                value={dateOrdered}
                                                onChange={handleDateOrdered}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Total Vials: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="100"
                                                value={totalVials}
                                                onChange={handleTotalVials}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Placbeo: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="checkbox"
                                                value={placebo}
                                                onChange={handlePlacebo}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Batch Number: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="123456789"
                                                value={batchNumber}
                                                onChange={handleBatchNumber}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        ID: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="987654321"
                                                value={id}
                                                onChange={handleId}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography><br /><Button variant="contained" onClick={() => { addDrug() }}>Add Drug</Button></Typography>

                                </div>
                            </Stack>
                        </Paper>
                    </div>

                    {loading && <div className="LoadingOverlay">
                        <CircularProgress />
                    </div>}
                </div>
            </div>
        </>
    );
}

export default AddDrug;