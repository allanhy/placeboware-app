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
    Table, TableHead,
    TableBody, TableRow,
    TableCell, Paper,
    CircularProgress,
    Popover,
    Breadcrumbs, Link
}
    from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useBavaria from "../hooks/useBavaria";
import { useParams } from "react-router-dom";

function BavariaDrug() {
    const { id } = useParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { entities } = useBavaria();
    const [drugs, setDrugs] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    // eslint-disable-next-line
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const isTrialPatientsDefined = Array.isArray(drugs.trialPatients) && drugs.trialPatients.length > 0;
    const [drugID, setDrugID] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

    useEffect(() => {
        const getDrugs = async () => {
            const drugEntity = await entities.drug.get(id);
            const drugData = {
                name: drugEntity.name,
                dateOrdered: drugEntity.dateOrdered,
                totalVials: drugEntity.totalVials,
                dateCompleted: drugEntity.dateCompleted,
                placebo: drugEntity.placebo,
                batchNumber: drugEntity.batchNumber,
                id: drugEntity.id,
                trialPatients: drugEntity.trialPatients,
                released: drugEntity.released
            };
            setDrugs(drugData);
            console.log(drugData);
        };
        const getPatients = async () => {
            const patientEntities = await entities.patient.list();
            const patientData = patientEntities.items.map((patient) => ({
                _id: patient._id,
                dob: patient.dob,
                height: patient.height,
                weight: patient.weight,
                bloodPressure: patient.bloodPressure,
                bloodType: patient.bloodType,
                temperature: patient.temperature,
                oxygenSaturation: patient.oxygenSaturation,
                uuid: patient.uuid,
                currentMedications: patient.currentMedications,
                familyHistory: patient.familyHistory,
                currentlyEmployed: patient.currentlyEmployed,
                currentlyInsured: patient.currentlyInsured,
                icdHealthCodes: patient.icdHealthCodes,
                allergies: patient.allergies,
                visits: patient.visits,
                completedDoses: patient.completedDoses,
                currentDrug: patient.currentDrug,
                drugIDs: patient.drugIDs,
                placebo: patient.placebo
            }));
            setPatients(patientData);
            setLoading(false);
        };
        getDrugs();
        getPatients();
    }, [entities.drug, entities.patient, id],);

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

    const handleDrugIDsClick = (patient) => {
        setDrugID(true);
        console.log(patient);
        setSelectedPatient(patient);
    };

    const handleDrugIDsClose = () => {
        setDrugID(false);
    };

    const handleViewResults = () => {
        navigate("/bavariapage/results/" + id);
    }

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
                            <Button variant="h2" href="/bavariapage">Home</Button>

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
                        <Link underline="hover" href={"/bavariapage/drug/" + id}>Drug Info</Link>
                    </Breadcrumbs>
                </Box>
            </div>

            <div className="BavariaPage-body">
                <Paper>
                    <Stack alignItems="center">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', paddingBottom: '1rem', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Trial Name: {drugs.name}
                            </span>
                        </div>
                    </Stack>
                </Paper>
            </div>

            <div className="BavariaPage-body">
                <Paper>
                    <Stack sx={{ marginRight: '15px', marginLeft: '15px', paddingBottom: '1rem', paddingTop: '1rem' }}>
                        <Box>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                Date Order Placed: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.dateOrdered}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                Total Vial Ordered: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.totalVials}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                Placebo: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.placebo ? "Yes" : "No"}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                Batch Number: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.batchNumber}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                ID: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.id}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                Date Completed: <span style={{ fontStyle: drugs.dateCompleted ? 'normal' : 'italic', fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.dateCompleted || 'Pending...'}</span>
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Typography variant="h4" style={{ display: 'inline-block', marginRight: '10px', paddingTop: '2rem', paddingBottom: '1rem' }}>
                    Shipment List:
                </Typography>

                {isTrialPatientsDefined ? (
                    <div>
                        <Paper>
                            <TableContainer sx={{ maxHeight: '550px' }}>
                                <Table aria-label='simple-table' stickyHeader>
                                    <>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>ID Number</TableCell>
                                                <TableCell>DOB</TableCell>
                                                <TableCell>ICD Codes</TableCell>
                                                <TableCell>Completed Doses</TableCell>
                                                <TableCell>Current Drug</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {loading ? (
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br />
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        ) : (
                                            <TableBody>
                                                {patients
                                                    .filter((patient) => {
                                                        console.log(patient);
                                                        return drugs.trialPatients.some((trialPatient) => trialPatient.allergy === patient.uuid);
                                                    })
                                                    .map((patient, index) => (
                                                        <TableRow key={index}
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 },
                                                                backgroundColor: index % 2 === 0 ? '#E0E0E0' : 'inherit'
                                                            }}>
                                                            <TableCell>
                                                                <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: red[500] }}></Avatar>
                                                            </TableCell>

                                                            <TableCell>
                                                                {patient.uuid}
                                                            </TableCell>
                                                            <TableCell>{patient.dob}</TableCell>
                                                            <TableCell>{patient.icdHealthCodes?.map((code, index) => (
                                                                <React.Fragment key={index}>
                                                                    {code.code}
                                                                    {index < patient.icdHealthCodes.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}</TableCell>
                                                            <TableCell>{patient.completedDoses} / 5</TableCell>
                                                            <TableCell className="profile" onClick={() => handleDrugIDsClick(patient)}>{patient.currentDrug}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                <Popover
                                                    open={drugID}
                                                    onClose={handleDrugIDsClose}
                                                    anchorEl={anchor}
                                                    anchorOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'center',
                                                    }}
                                                    sx={{
                                                        backgroundColor: 'rgba(128, 128, 128, 0.8)'
                                                    }}
                                                >
                                                    {selectedPatient && (
                                                        <>
                                                            <Typography sx={{ p: 2 }}>
                                                                <b>Dose IDs:</b>
                                                                {selectedPatient.drugIDs?.map((item, index) => (
                                                                    <Typography key={index} component="div">
                                                                        {`${index + 1}: ${item.patientDrugIDs}`}
                                                                    </Typography>
                                                                ))}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Popover>
                                            </TableBody>
                                        )}
                                    </>

                                </Table>
                            </TableContainer>
                        </Paper>
                        <Typography variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
                            <Button
                                variant="contained"
                                disabled={!drugs.released}
                                onClick={handleViewResults}
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '10px',
                                    padding: '15px 30px',
                                }}
                            >
                                View Results
                            </Button>
                        </Typography>
                    </div>
                ) : (
                    <Paper>
                        <TableContainer sx={{ maxHeight: '550px' }}>
                            <Table aria-label='simple-table' stickyHeader>
                                {loading ? (
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                ) : (
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '2rem', fontWeight: 'bold', fontStyle: 'italic' }}>--- Waiting for FDA to Assign Patients ---</span><br /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                )}
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

            </div>
            {loading && <div className="LoadingOverlay">
                <CircularProgress />
            </div>}
        </>
    );
}
export default BavariaDrug;
