import React, { useState, useEffect } from "react";
import "../styles/FDAPage.css";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { red, blue } from "@mui/material/colors";
import {
    AppBar,
    Avatar,
    IconButton,
    Drawer,
    Box,
    Stack,
    Typography,
    TableContainer,
    TableHead,
    TableRow,
    TableCell, Paper,
    CircularProgress,
    Popover,
    Breadcrumbs
}
    from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate, Link, useParams } from "react-router-dom";
import useFDA from "../hooks/useFDA";

function ResultsPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { id } = useParams();
    const { entities } = useFDA();
    const [drugs, setDrugs] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    // eslint-disable-next-line
    const [anchor, setAnchor] = useState(null);
    const [drugID, setDrugID] = useState(false);
    const open = Boolean(anchorEl);
    const isFDA = user.email && user.email.split('@')[1] === 'fda.gov' ? true : false;

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // eslint-disable-next-line
            const isFDA = user.email && user.email.split('@')[1] === 'fda.gov' ? true : false;
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
                drugIDs: drugEntity.drugIDs,
                released: drugEntity.released,
                success: drugEntity.success
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
                eligible: patient.eligible,
                currentDrug: patient.currentDrug,
                drugIDs: patient.drugIDs,
                placebo: patient.placebo
            }));
            setPatients(patientData);
            setLoading(false);
        };
        getDrugs();
        getPatients();
    }, [entities.drug, entities.patient, id]);

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

    return (
        <div>
            {isFDA ? (
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

                    <div className="breadcrumbs">
                        <Box m={2}>
                            <Breadcrumbs aria-label='breadcrumb' sx={{ color: blue[900] }}>
                                <Link underline="hover" sx={{ color: blue[900] }} to='/fdapage'>Home</Link>
                                <Link underline="hover" sx={{ color: blue[900] }} to={"/fdapage/results/" + id}>Drug Info</Link>
                            </Breadcrumbs>
                        </Box>
                    </div>

                    <div className="FDAPage-body">
                        <>
                            <div>
                                <Paper>
                                    <Stack alignItems="center">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px', paddingBottom: '1rem', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Trial Name: {drugs.name}
                                            </span>
                                        </div>
                                    </Stack>
                                    <Stack sx={{ marginRight: '15px', marginLeft: '15px', paddingBottom: '1rem', paddingTop: '1rem' }}>
                                        <Box>
                                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                                Successful?: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.success ? "Yes" : "No"}</span>
                                            </Typography>
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
                            </div>
                            <>
                                {loading ? (
                                    <Paper>
                                        <TableContainer sx={{ maxHeight: '550px' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br />
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </TableContainer>
                                    </Paper>
                                ) : (
                                    <Paper >
                                        <TableContainer sx={{ maxHeight: '500px' }}>
                                            {patients
                                                .filter((patient) => {
                                                    return drugs && Array.isArray(drugs.trialPatients) && drugs.trialPatients.some((trialPatient) => trialPatient.allergy === patient.uuid);
                                                })
                                                .map((patient, index) => {
                                                    const visits = patient.visits;
                                                    const firstVisit = visits[0];
                                                    const latestVisit = visits[visits.length - 1];
                                                    const firstViralLoad = firstVisit.hivViralLoad.split(' ')[0];
                                                    const latestViralLoad = latestVisit.hivViralLoad.split(' ')[0];

                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Box
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
                                                                    className="drugInformation"
                                                                    onClick={() => handleDrugIDsClick(patient)}
                                                                >
                                                                    <Box sx={{ borderColor: 'black' }}>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            Patient UUID:
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {patient.uuid}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            Placebo:
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {patient.placebo ? "Yes" : "No"}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            HIV Load (Before/After):
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {latestViralLoad + " / " + firstViralLoad + " copies/mL"}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
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
                                                            <b>Height:</b> {selectedPatient.height}
                                                            <br />
                                                            <b>Weight:</b> {selectedPatient.weight}
                                                            <br />
                                                            <b>Blood Presure:</b> {selectedPatient.bloodPressure}
                                                            <br />
                                                            <b>Blood Type:</b> {selectedPatient.bloodType}
                                                            <br />
                                                            <b>Temperature:</b> {selectedPatient.temperature}
                                                            <br />
                                                            <b>Oxygen Saturation:</b> {selectedPatient.oxygenSaturation}
                                                            <br />
                                                            <b>Allergies:</b> {selectedPatient.allergies?.map((allergy, index) => (
                                                                <React.Fragment key={index}>
                                                                    {allergy.allergy}
                                                                    {index < selectedPatient.allergies.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}
                                                            <br />
                                                            <b>Current Medications:</b> {selectedPatient.currentMedications?.map((medication, index) => (
                                                                <React.Fragment key={index}>
                                                                    {medication.medication}
                                                                    {index < selectedPatient.currentMedications.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}
                                                            <br />
                                                            <b>Family History:</b> {selectedPatient.familyHistory}
                                                            <br />
                                                            <b>Currently Employed:</b> {selectedPatient.currentlyEmployed ? 'Yes' : 'No'}
                                                            <br />
                                                            <b>Currently Insured:</b> {selectedPatient.currentlyInsured ? 'Yes' : 'No'}
                                                            <br />

                                                        </Typography>
                                                        <Typography sx={{ p: 2 }}>
                                                        <b>HIV Viral Load Before:</b> {selectedPatient.visits[selectedPatient.visits.length - 1].hivViralLoad.split(' ')[0]} copies/mL ({selectedPatient.visits[selectedPatient.visits.length - 1].dateTime})
                                                            <br />
                                                            <b>HIV Viral Load After:</b> {selectedPatient.visits[0].hivViralLoad.split(' ')[0]} copies/mL ({selectedPatient.visits[0].dateTime})
                                                            <br />
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
                                        </TableContainer>
                                    </Paper>
                                )}
                            </>

                        </>
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

                    <div className="breadcrumb">
                        <Box m={2}>
                            <Breadcrumbs aria-label='breadcrumb'>
                                <Link underline="hover" to="/bavariapage">Home</Link>
                                <Link underline="hover" to={"/bavariapage/drug/" + id}>Drug Info</Link>
                                <Link underline="hover" to={"/bavariapage/results/" + id}>Results Info</Link>
                            </Breadcrumbs>
                        </Box>
                    </div>

                    <div className="BavariaPage-body">
                        <>
                            <div>
                                <Paper>
                                    <Stack alignItems="center">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px', paddingBottom: '1rem', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Trial Name: {drugs.name}
                                            </span>
                                        </div>
                                    </Stack>
                                    <Stack sx={{ marginRight: '15px', marginLeft: '15px', paddingBottom: '1rem', paddingTop: '1rem' }}>
                                        <Box>
                                            <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                                Successful?: <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>{drugs.success ? "Yes" : "No"}</span>
                                            </Typography>
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
                            </div>
                            <>
                                {loading ? (
                                    <Paper>
                                        <TableContainer sx={{ maxHeight: '550px' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br />
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </TableContainer>
                                    </Paper>
                                ) : (
                                    <Paper >
                                        <TableContainer sx={{ maxHeight: '500px' }}>
                                            {patients
                                                .filter((patient) => {
                                                    return drugs && Array.isArray(drugs.trialPatients) && drugs.trialPatients.some((trialPatient) => trialPatient.allergy === patient.uuid);
                                                })
                                                .map((patient, index) => {
                                                    const visits = patient.visits;
                                                    const firstVisit = visits[0];
                                                    const latestVisit = visits[visits.length - 1];
                                                    const firstViralLoad = firstVisit.hivViralLoad.split(' ')[0];
                                                    const latestViralLoad = latestVisit.hivViralLoad.split(' ')[0];

                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Box
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
                                                                    className="drugInformation"
                                                                    onClick={() => handleDrugIDsClick(patient)}
                                                                >
                                                                    <Box sx={{ borderColor: 'black' }}>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            Patient UUID:
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {patient.uuid}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            Placebo:
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {patient.placebo ? "Yes" : "No"}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: "black" }}>
                                                                            HIV Load (Before/After):
                                                                        </Typography>
                                                                        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: "black" }}>
                                                                            {latestViralLoad + " / " + firstViralLoad + " copies/mL"}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
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
                                                            <b>Height:</b> {selectedPatient.height}
                                                            <br />
                                                            <b>Weight:</b> {selectedPatient.weight}
                                                            <br />
                                                            <b>Blood Presure:</b> {selectedPatient.bloodPressure}
                                                            <br />
                                                            <b>Blood Type:</b> {selectedPatient.bloodType}
                                                            <br />
                                                            <b>Temperature:</b> {selectedPatient.temperature}
                                                            <br />
                                                            <b>Oxygen Saturation:</b> {selectedPatient.oxygenSaturation}
                                                            <br />
                                                            <b>Allergies:</b> {selectedPatient.allergies?.map((allergy, index) => (
                                                                <React.Fragment key={index}>
                                                                    {allergy.allergy}
                                                                    {index < selectedPatient.allergies.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}
                                                            <br />
                                                            <b>Current Medications:</b> {selectedPatient.currentMedications?.map((medication, index) => (
                                                                <React.Fragment key={index}>
                                                                    {medication.medication}
                                                                    {index < selectedPatient.currentMedications.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}
                                                            <br />
                                                            <b>Family History:</b> {selectedPatient.familyHistory}
                                                            <br />
                                                            <b>Currently Employed:</b> {selectedPatient.currentlyEmployed ? 'Yes' : 'No'}
                                                            <br />
                                                            <b>Currently Insured:</b> {selectedPatient.currentlyInsured ? 'Yes' : 'No'}
                                                            <br />

                                                        </Typography>
                                                        <Typography sx={{ p: 2 }}>

                                                            <b>HIV Viral Load Before:</b> {selectedPatient.visits[selectedPatient.visits.length - 1].hivViralLoad.split(' ')[0]} copies/mL ({selectedPatient.visits[selectedPatient.visits.length - 1].dateTime})
                                                            <br />
                                                            <b>HIV Viral Load After:</b> {selectedPatient.visits[0].hivViralLoad.split(' ')[0]} copies/mL ({selectedPatient.visits[0].dateTime})
                                                            <br />
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
                                        </TableContainer>
                                    </Paper>
                                )}
                            </>

                        </>
                    </div>

                </>)}

            {loading && <div className="LoadingOverlay">
                <CircularProgress />
            </div>}
        </div>

    );
}
export default ResultsPage;
