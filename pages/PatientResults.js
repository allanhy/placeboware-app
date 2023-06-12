import {
    AppBar,
    Breadcrumbs,
    CircularProgress,
    Avatar,
    IconButton,
    Drawer,
    Box,
    Stack,
    Paper,
    Typography, Link,
    Popover,
}
    from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import MenuIcon from '../idk.png'
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { red, blue } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import "../styles/Patient.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useFDA from "../hooks/useFDA";

const PatientResults = () => {
    const { uuid } = useParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { entities } = useFDA();
    const [patients, setPatients] = useState({});
    const [drugs, setDrugs] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const latestVisit = patients.visits?.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0];
    const isFDA = user.email && user.email.split('@')[1] === 'fda.gov' ? true : false;

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    useEffect(() => {
        const getPatient = async () => {
            setLoading(true);
            const patientEntity = await entities.patient.get(uuid);
            const patientData = {
                dob: patientEntity.dob,
                height: patientEntity.height,
                weight: patientEntity.weight,
                bloodPressure: patientEntity.bloodPressure,
                bloodType: patientEntity.bloodType,
                temperature: patientEntity.temperature,
                oxygenSaturation: patientEntity.oxygenSaturation,
                uuid: patientEntity.uuid,
                address: patientEntity.address,
                currentMedications: patientEntity.currentMedications,
                familyHistory: patientEntity.familyHistory,
                currentlyEmployed: patientEntity.currentlyEmployed,
                currentlyInsured: patientEntity.currentlyInsured,
                icdHealthCodes: patientEntity.icdHealthCodes,
                allergies: patientEntity.allergies,
                visits: patientEntity.visits,
                completedDoses: patientEntity.completedDoses,
                currentDrug: patientEntity.currentDrug,
            };
            setPatients(patientData);
            setLoading(false);
        };
        getPatient();

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
                drugIDs: drug.drugIDs,
                trialPatients: drug.trialPatients,
            }));
            setDrugs(drugData);
            setLoading(false); // set loading state to false
            console.log(drugData);
        };
        getDrugs();
    }, [entities.patient, entities.drug]);


    return (
        <div>
            {isFDA ? (
                <>
                    <div>
                        <AppBar color="inherit" position="static">
                            <ToolBar>
                                <>
                                    <IconButton onClick={() => setIsDrawerOpen(true)}>
                                        <img src={MenuIcon} alt="" />
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
                                                    Bavaria
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Drawer>
                                </>

                                <Typography variant="h5" component='div' sx={{ flexGrow: 1 }}>
                                    FDA
                                    <Button variant="h2" href="/fdapage">Home</Button>
                                </Typography>


                                <Stack direction="row" spacing={2}>
                                    <div className="profile"><Avatar sx={{ bgcolor: blue[900] }} onClick={handleClick}>FD</Avatar></div>
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
                                            <Avatar sx={{ bgcolor: blue[900] }}>FD</Avatar>
                                            <Box ml={1}>
                                                <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Logged in as FDA
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
                </>
            ) : (
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

                    <div className="patient-breadcrumb-bavaria">
                        <Box m={2}>
                            <Breadcrumbs aria-label='breadcrumb'>
                                <Link underline="hover" to="/bavariapage">Home</Link>
                                <Link underline="hover" href={"/bavariapage/drug/" + selectedDrug}>Drug Info</Link>
                                <Link underline="hover" to={"/bavariapage/results/" + selectedDrug}>Results Info</Link>
                                <Link underline="hover" to={"/bavariapage/results/" + selectedDrug + "/patient/" + uuid}>Patient Info</Link>
                            </Breadcrumbs>
                        </Box>
                    </div>

                    <div className="patient">
                        <div className="something">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px', paddingBottom: '1rem' }}>Patient ID: {patients.uuid}
                                </span>
                            </div>
                            <div className="patient-container">
                                <Paper className="patient-top">
                                    <Stack direction="row" alignItems="center">
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Name: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.name}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    DOB: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.dob}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Insurance #: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.insuranceNumber}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Address: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.address}</span>
                                                </Typography>
                                            </div>
                                        </>
                                    </Stack>
                                </Paper>
                            </div>
                            <div className="patient-left-right">
                                <div className="patient-left">
                                    <Paper className="patient-bottom-info">
                                        <Stack>
                                            <>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Patient ID: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.uuid} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    ICD Health Codes: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                        {patients.icdHealthCodes?.map((code, index) => (
                                                            <React.Fragment key={index}>
                                                                {code.code}
                                                                {index < patients.icdHealthCodes.length - 1 ? ', ' : ''}
                                                            </React.Fragment>
                                                        ))}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Allergies: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                        {patients.allergies?.map((allergy, index) => (
                                                            <React.Fragment key={index}>
                                                                {allergy.allergy}
                                                                {index < patients.allergies.length - 1 ? ', ' : ''}
                                                            </React.Fragment>
                                                        ))} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Current Medications: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                        {patients.currentMedications?.map((medication, index) => (
                                                            <React.Fragment key={index}>
                                                                {medication.medication}
                                                                {index < patients.currentMedications.length - 1 ? ', ' : ''}
                                                            </React.Fragment>
                                                        ))} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Height: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.height} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Weight: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.weight} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Blood Pressure: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.bloodPressure} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Blood Type: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.bloodType}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Temperature: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.temperature} </span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Oxygen Saturation: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.oxygenSaturation} </span>
                                                </Typography>

                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Family History: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.familyHistory}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Currently Employed: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.currentlyEmployed}</span>
                                                </Typography>
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    Currently Insured: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>{patients.currentlyInsured}</span>
                                                </Typography>
                                            </>
                                        </Stack>
                                    </Paper>
                                </div>
                                <div className="patient-middle">
                                    <Paper className="patient-bottom-info">
                                        <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                            Visits: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                {patients.visits?.map((visit, index) => (
                                                    <React.Fragment key={index}>
                                                        <br />Current Dose: {visit.currentDose}
                                                        <br />Date and Time: {visit.dateTime}
                                                        <br />General Notes: {visit.notes || <span style={{ fontStyle: 'italic' }}>Pending...</span>}
                                                        <br />HIV Viral Load: {visit.hivViralLoad || <span style={{ fontStyle: 'italic' }}>Pending...</span>}<br />
                                                    </React.Fragment>
                                                ))} </span>
                                        </Typography>
                                    </Paper>
                                </div>
                            </div>
                            {loading && <div className="LoadingOverlay">
                                <CircularProgress />
                            </div>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientResults;