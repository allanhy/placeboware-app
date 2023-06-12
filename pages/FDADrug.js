import React, { useState, useEffect } from "react";
import "../styles/FDAPage.css";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { blue } from "@mui/material/colors";
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
    Checkbox,
    Popover,
    Breadcrumbs,
    Link
}
    from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useBavaria from "../hooks/useBavaria";
import { useParams } from "react-router-dom";

function FDADrug() {
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
    const [success, setSuccess] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    // eslint-disable-next-line
    const [filteredPatients, setFilteredPatients] = useState([]);
    const open = Boolean(anchorEl);
    const [drugID, setDrugID] = useState(false);
    const isTrialPatientsDefined = Array.isArray(drugs.trialPatients) && drugs.trialPatients.length > 0;

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
                drugIDs: drugEntity.drugIDs,
                released: drugEntity.released,
                success: drugEntity.success
            };
            setDrugs(drugData);
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

    const allPatientsSelected = () => {
        return patients.length === selectedPatients.length;
    };

    const handleReleaseResult = async () => {
        setLoading(true);

        // Get the drug entity with the given id
        const drugEntity = await entities.drug.get(id);

        // Set the released property to true for the drug entity
        const updatedDrug = await entities.drug.update({
            _id: drugEntity._id,
            released: true,
            success: success
        });

        // Get the trial patients for the drug entity and update their placebo value
        const updatedPatientPromises = drugEntity.trialPatients.map(async ({ allergy: patient }) => {
            const patientEntityList = await entities.patient.list({ filter: { uuid: { contains: patient } } });
            const matchingPatientEntity = patientEntityList.items.find((patientEntity) => {
                console.log(patientEntity); // Log the patientEntity value
                return patientEntity.uuid === patient;
            });
            console.log(matchingPatientEntity);
            if (!matchingPatientEntity) {
                throw new Error(`Patient with UUID ${patient.uuid} not found`);
            }
            const updatedPatient = await entities.patient.update({
                _id: matchingPatientEntity._id,
                placebo: drugEntity.placebo,
            });
            return updatedPatient;
        });

        const updatedPatients = await Promise.all(updatedPatientPromises);

        // Update the state with the updated drug and patients
        setDrugs(updatedDrug);
        setPatients(updatedPatients);
        setLoading(false);
        setSuccess(false);
        navigate("/fdapage");
    };

    const handleDrugUpdate = async () => {
        setLoading(true);

        const selectedPatientUUIDs = selectedPatients.map((patientId) => {
            const patient = patients.find(p => p._id === patientId);
            return { allergy: patient.uuid }
        });

        const drugEntity = await entities.drug.get(id);
        const drugIDs = drugEntity.drugIDs.map(obj => obj.ids); // extract the string value from the array of drugIDs

        const assignedDrugIDs = new Set(); // set to track assigned drugIDs
        const updatedPatientPromises = selectedPatients.map(async (patientId) => {
            const patient = patients.find(p => p._id === patientId);
            const { drugIDs: patientDrugIDs } = patient;
            const newDrugIDs = [];

            // assign 5 unique drugIDs to the patient
            while (newDrugIDs.length < 5) {
                const unusedDrugIDs = drugIDs.filter(id => {
                    const notAssigned = !assignedDrugIDs.has(id);
                    const notPatientDrug = patientDrugIDs ? !patientDrugIDs.includes(id) : true;
                    return notAssigned && notPatientDrug;
                });
                if (unusedDrugIDs.length === 0) {
                    throw new Error("Not enough unused drugIDs");
                }
                const randomDrugID = unusedDrugIDs[Math.floor(Math.random() * unusedDrugIDs.length)];
                newDrugIDs.push({ patientDrugIDs: randomDrugID });
                assignedDrugIDs.add(randomDrugID);
            }

            const updatedPatient = await entities.patient.update({
                _id: patientId,
                completedDoses: "0",
                drugName: drugEntity.name,
                currentDrug: drugEntity.id,
                drugIDs: newDrugIDs// replace drugIDs with patientDrugIDs
            });
            return updatedPatient;
        });
        const updatedPatients = await Promise.all(updatedPatientPromises);

        const updatedDrug = await entities.drug.update({
            _id: drugEntity._id,
            trialPatients: selectedPatientUUIDs,
        });

        setFilteredPatients(prevState => prevState.map(patient => {
            const updatedPatient = updatedPatients.find(p => p._id === patient._id);
            if (updatedPatient) {
                return updatedPatient;
            }
            return patient;
        }));
        setDrugs(updatedDrug);
        setSelectedPatients([]);
        window.location.reload();
    };

    const handleDrugIDsClick = (patient) => {
        setDrugID(true);
        console.log(patient);
        setSelectedPatient(patient);
    };

    const handleDrugIDsClose = () => {
        setDrugID(false);
    };

    const handleSuccess = (event) => {
        setSuccess(event.target.checked);
    };

    return (
        <>
            <div>
                <AppBar color="inherit" position="static">
                    <ToolBar>
                        <>
                            <IconButton onClick={() => setIsDrawerOpen(true)}>
                                <Menu sx={{fontSize: '1.75rem'}}/>
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
                        <Link underline="hover" sx={{ color: blue[900] }} href='/fdapage'>Home</Link>
                        <Link underline="hover" sx={{ color: blue[900] }} href={"/fdapage/drug/" + id}>Drug Info</Link>
                    </Breadcrumbs>
                </Box>
            </div>

            <div className="FDAPage-body">
                <Paper>
                    <Stack alignItems="center">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', paddingBottom: '1rem', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Trial Name: {drugs.name}
                            </span>
                        </div>
                    </Stack>
                </Paper>
            </div>

            <div className="FDAPage-body">
                <div>
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
                                {isTrialPatientsDefined && (
                                    <Typography variant="h6" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                        Successful?:<Checkbox
                                            type="checkbox"
                                            checked={success}
                                            onChange={handleSuccess}
                                            disabled={
                                                !drugs.trialPatients.every(trialPatient => {
                                                    const matchingPatient = patients.find(patient => patient.uuid === trialPatient.allergy);
                                                    return matchingPatient && matchingPatient.completedDoses === "5";
                                                })
                                            }
                                        />
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Paper>
                </div>
                <Typography variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
                    <Button
                        variant="contained"
                        disabled={isTrialPatientsDefined ?
                            !drugs.trialPatients.every(trialPatient => {
                                const matchingPatient = patients.find(patient => patient.uuid === trialPatient.allergy);
                                return matchingPatient && matchingPatient.completedDoses === "5";
                            }) :
                            selectedPatients.length === 0}
                        onClick={isTrialPatientsDefined ? handleReleaseResult : handleDrugUpdate}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            padding: '15px 30px',
                        }}
                    >
                        {isTrialPatientsDefined ? 'Release Results' : 'Add Patient To Trial'}
                    </Button>
                </Typography>

                <Paper>
                    <TableContainer sx={{ maxHeight: '550px' }}>
                        {isTrialPatientsDefined ? (
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
                                                    return drugs.trialPatients.some((trialPatient) => trialPatient.allergy === patient.uuid);
                                                })
                                                .map((patient, index) => {
                                                    const visits = patient.visits;
                                                    const firstVisit = visits[0];
                                                    const latestVisit = visits[visits.length - 1];
                                                    const firstViralLoad = firstVisit.hivViralLoad.split(' ')[0];
                                                    const latestViralLoad = latestVisit.hivViralLoad.split(' ')[0];
                                                    return (
                                                    <TableRow key={index}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            backgroundColor: index % 2 === 0 ? '#E0E0E0' : 'inherit'
                                                        }}>
                                                        <TableCell>
                                                            <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: blue[500] }}></Avatar>
                                                        </TableCell>

                                                        <TableCell className="profile" onClick={() => handleDrugIDsClick(patient)}>
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
                                                        <TableCell>{patient.currentDrug}</TableCell>
                                                    </TableRow>
                                                    );
                                                })
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
                        ) : (
                            <Paper>
                                <TableContainer sx={{ maxHeight: '550px' }}>
                                    <Table aria-label='simple-table' stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><Checkbox
                                                    checked={allPatientsSelected()}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setSelectedPatients(isChecked ? patients.map(patient => patient._id) : []);
                                                    }}
                                                /></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>ID Number</TableCell>
                                                <TableCell>DOB</TableCell>
                                                <TableCell>ICD Codes</TableCell>
                                                <TableCell>Family History</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {loading ? (
                                            <TableCell><span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br /></TableCell>
                                        ) : (
                                            <TableBody>
                                                {patients.filter(patient => (!patient.currentDrug && patient.eligible === "Yes")).map((patient, index) => (
                                                    <TableRow key={index}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            backgroundColor: index % 2 === 0 ? '#E0E0E0' : 'inherit'
                                                        }}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPatients.indexOf(patient._id) !== -1}
                                                                onChange={(e) => {
                                                                    const patientId = e.target.value;
                                                                    if (e.target.checked) {
                                                                        setSelectedPatients([...selectedPatients, patientId]);
                                                                    } else {
                                                                        setSelectedPatients(selectedPatients.filter((id) => id !== patientId));
                                                                    }
                                                                }} value={patient._id}
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: blue[500] }}></Avatar>
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
                                                        <TableCell>{patient.familyHistory}</TableCell>
                                                    </TableRow>
                                                ))
                                                }
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                    </TableContainer>
                </Paper>
            </div>
            {loading && <div className="LoadingOverlay">
                <CircularProgress />
            </div>}
        </>
    );
}
export default FDADrug;
