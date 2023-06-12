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
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { pink, purple } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import "../styles/Patient.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useJaneHopkins from "../hooks/useJaneHopkins";

const Appointment = () => {
    const { uuid } = useParams();
    const { id } = useParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { entities } = useJaneHopkins();
    const [patients, setPatients] = useState({});
    const [allPatients, setAllPatients] = useState({});
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [visits, setVisits] = useState([]);
    const [dateTime, setDateTime] = useState("");
    const [notes, setNotes] = useState("");
    const [hivViralLoad, setHivViralLoad] = useState("");
    const open = Boolean(anchorEl);
    const latestVisit = patients.visits?.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0];

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

    const handleNotes = (event) => {
        setNotes(event.target.value);
    };
    const handleHivViralLoad = (event) => {
        setHivViralLoad(event.target.value);
    };

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

    useEffect(() => {
        const getPatient = async () => {
            setLoading(true);
            const patientEntity = await entities.patient.get(uuid);
            console.log(patientEntity);
            const patientData = {
                _id: patientEntity._id,
                name: patientEntity.name,
                patientPicture: patientEntity.patientPicture,
                dob: patientEntity.dob,
                insuranceNumber: patientEntity.insuranceNumber,
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
                currentDrug: patientEntity.currentDrug
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

        const getAllPatients = async () => {
            setLoading(true); // set loading state to true
            const patientEntities = await entities.patient.list();
            const allPatientData = patientEntities.items.map((patient) => ({
              _id: patient._id,
              name: patient.name,
              patientPicture: patient.patientPicture,
              dob: patient.dob,
              insuranceNumber: patient.insuranceNumber,
              height: patient.height,
              weight: patient.weight,
              bloodPressure: patient.bloodPressure,
              bloodType: patient.bloodType,
              temperature: patient.temperature,
              oxygenSaturation: patient.oxygenSaturation,
              uuid: patient.uuid,
              address: patient.address,
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
            }));
            setAllPatients(allPatientData);
            setLoading(false);
        };
        getAllPatients();
    }, [entities.patient, entities.drug]);

    const handleSaveClick = async () => {
        setIsEditing(false);
        setLoading(true);
            
        const patientEntity = await entities.patient.get(uuid);

        const latestVisitIndex = patients.visits.findIndex(
            (visit) => visit.dateTime === latestVisit.dateTime
          );

          if (latestVisit.currentDose > patients.completedDoses) {
            // increment the completedDoses value by 1
            patients.completedDoses = (parseInt(patients.completedDoses) + 1).toString();
        }
        
          const updatedVisit = {
            ...latestVisit,
            notes,
            hivViralLoad,
          };
        
          // Replace the latest visit object with the updated one in the visits array
          const updatedVisits = [...patients.visits];
          updatedVisits[latestVisitIndex] = updatedVisit;

        const updatedPatient = await entities.patient.update({
            _id: patientEntity._id,
            height: patients.height,
            weight: patients.weight,
            bloodPressure: patients.bloodPressure,
            bloodType: patients.bloodType,
            temperature: patients.temperature,
            oxygenSaturation: patients.oxygenSaturation,
            visits: updatedVisits,
            completedDoses: patients.completedDoses,
        });
        setLoading(false);
        handleDateCompleted();
        console.log(updatedPatient);
        navigate("/doctor/janehopkinspage/patient/" + uuid);
    };

    const handleDateCompleted = async () => {
        const matchingDrug = drugs.find((drug) => drug.id === patients.currentDrug);
        const matchingDrugs = matchingDrug.trialPatients.map(async ({ allergy: patient }) => {
          console.log(patient);
          const patientEntityList = await entities.patient.list({ filter: { uuid: { contains: patient } } });
          console.log(patientEntityList);
          const completedPatientEntity = patientEntityList.items.every((patientEntity) => {
            return parseInt(patientEntity.completedDoses) === 5;
          });
          console.log(completedPatientEntity);
          return completedPatientEntity; // Return the result for each patient
        });
      
        const allCompleted = await Promise.all(matchingDrugs); // Await the completion of all patient checks
        console.log(allCompleted);
      
        if (allCompleted.every((value) => value === true)) {
          const currentDate = new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
      
          await entities.drug.update({
            _id: matchingDrug._id,
            dateCompleted: currentDate,
          });
        }
      };
      

    return (
        <>
            <div className="patient-background">
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
                                            FDA
                                        </Button>
                                        <Button variant="string" href="/">
                                            Bavaria
                                        </Button>
                                    </Stack>
                                </Box>
                            </Drawer>
                        </>

                        <Typography variant="h5" component='div' sx={{ flexGrow: 1 }}>
                            JANE HOPKINS
                            <Button variant="h2" href="/doctor/janehopkinspage">Home</Button>
                        </Typography>

                        <Stack direction='row' spacing={2}>
                            <div className="profile"><Avatar sx={{ bgcolor: purple[500] }} onClick={handleClick}>DR</Avatar></div>
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
                                    <Avatar sx={{ bgcolor: purple[500] }}>DR</Avatar>
                                    <Box ml={1}>
                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Logged in as Jane Hopkins
                                        </Typography>
                                        <Typography variant="body2">{user.email} <span style={{ fontSize: '0.7rem' }}> (Doctor)</span></Typography>
                                    </Box>
                                </Box>
                                <div className="submenu"><Box bgcolor="rgba(0,0,0,0.1)" p={2} flexGrow={1} borderTop="1px solid rgba(0, 0, 0, 0.2)" onClick={handleLogout}>
                                    Admin View
                                </Box></div>
                                <div className="submenu"><Box bgcolor="rgba(0,0,0,0.1)" p={2} flexGrow={1} borderTop="1px solid rgba(0, 0, 0, 0.2)" onClick={handleLogout}>
                                Log Out<Logout sx={{ fontSize: '1rem', marginLeft: '0.5rem' }} />
                                </Box></div>
                            </Box>
                        </Popover>
                    </ToolBar>
                </AppBar>
            </div>

            <div className="patient-breadcrumb">
                <Box m={2}>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Link underline="hover" href='/doctor/janehopkinspage'>Home</Link>
                        <Link underline="hover" href={"/doctor/janehopkinspage/patient/" + uuid}>Patient Info</Link>
                        <Link underline="hover" href={"/doctor/janehopkinspage/patient/" + uuid + "/doseInfo"}>Dose Information</Link>
                    </Breadcrumbs>
                </Box>
            </div>

            <div className="patient">
                <div className="something">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', paddingBottom: '1rem' }}>Dose Information

                        </span>
                    </div>
                    <div className="patient-container">
                        <Paper className="patient-top">
                            <Stack direction="row" alignItems="center">
                                <>
                                    <Avatar src={patients.patientPicture} alt={patients.name} sx={{ width: 100, height: 100, bgcolor: pink[500], marginRight: '0.5rem' }}></Avatar>
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
                                            Height: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                <input
                                                    type="string"
                                                    placeholder="5'11&quot;"
                                                    value={patients.height}
                                                    onChange={(e) =>
                                                        setPatients({ ...patients, height: e.target.value })
                                                    }
                                                />
                                            </span>
                                        </Typography>
                                        <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Weight: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                <input
                                                    type="string"
                                                    placeholder="100 lbs"
                                                    value={patients.weight}
                                                    onChange={(e) =>
                                                        setPatients({ ...patients, weight: e.target.value })
                                                    }
                                                />
                                            </span>
                                        </Typography>
                                        <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Blood Pressure: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                <input
                                                    type="string"
                                                    placeholder="120/70 mmHg"
                                                    value={patients.bloodPressure}
                                                    onChange={(e) =>
                                                        setPatients({ ...patients, bloodPressure: e.target.value })
                                                    }
                                                />
                                            </span>
                                        </Typography>
                                        <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Temperature: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                <input
                                                    type="string"
                                                    placeholder="98.9 F"
                                                    value={patients.temperature}
                                                    onChange={(e) =>
                                                        setPatients({ ...patients, temperature: e.target.value })
                                                    }
                                                />
                                            </span>
                                        </Typography>
                                        <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Oxygen Saturation: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                                <input
                                                    type="string"
                                                    placeholder="99%"
                                                    value={patients.oxygenSaturation}
                                                    onChange={(e) =>
                                                        setPatients({ ...patients, oxygenSaturation: e.target.value })
                                                    }
                                                />
                                            </span>
                                        </Typography>
                                    </>
                                </Stack>
                            </Paper>
                        </div>
                        <div className="patient-right-add">
                            <Paper className="patient-dose-notes">
                                <div className="dose-container" style={{ float: 'right' }}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {latestVisit && (
                                            <React.Fragment>
                                                Dose #{latestVisit.currentDose}
                                                <br />Date: {latestVisit.dateTime.split(' ')[0]} <br />Time: {latestVisit.dateTime.split(' ')[1] + ' ' + latestVisit.dateTime.split(' ')[2]}<br />
                                            </React.Fragment>
                                        )}
                                    </Typography>
                                </div>
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                    HIV Viral Load: <input type="string" placeholder="100 copies/mL" value={hivViralLoad} onChange={handleHivViralLoad}/>
                                    <br />
                                    Notes: <br/>
                                    <textarea value={notes} style={{ height: '100px', width: '400px' }} onChange={handleNotes}/>
                                </Typography>
                                <Button variant="contained" onClick={handleSaveClick}>Submit</Button>
                            </Paper>
                        </div>
                    </div>

                    {loading && <div className="LoadingOverlay">
                        <CircularProgress />
                    </div>}
                </div>
            </div>
        </>
    );
}

export default Appointment;