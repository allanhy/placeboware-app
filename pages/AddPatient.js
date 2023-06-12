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
    Checkbox,
    CircularProgress,
    Popover
}
    from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Menu } from "@mui/icons-material";
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

const AddPatient = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { entities } = useJaneHopkins();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [name, setName] = useState('');
    const [patientPicture, setPatientPicture] = useState("");
    const [dob, setDob] = useState('');
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [temperature, setTemperature] = useState('');
    const [oxygenSaturation, setOxygenSaturation] = useState('');
    const [uuid, setUuid] = useState('');
    const [address, setAddress] = useState('');
    const [currentMedications, setCurrentMedications] = useState([]);
    const [medication, setMedication] = useState("");
    const [familyHistory, setFamilyHistory] = useState('');
    const [currentlyEmployed, setCurrentlyEmployed] = useState("no");
    const [currentlyInsured, setCurrentlyInsured] = useState('no');
    const [icdHealthCodes, setIcdHealthCodes] = useState([]);
    const [code, setIcdCodes] = useState("");
    const [allergies, setAllergies] = useState([]);
    const [allergy, setAllergy] = useState("");
    const [visits, setVisits] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [notes, setNotes] = useState("");
    const [hivViralLoad, setHivViralLoad] = useState("");
    const [currentDose, setCurrentDose] = useState("0");

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const addPatient = async () => {
        setLoading(true);
        const newPatient = {
            name,
            patientPicture,
            dob,
            insuranceNumber,
            height,
            weight,
            bloodPressure,
            bloodType,
            temperature,
            oxygenSaturation,
            uuid,
            address,
            currentMedications: medication.split(",").map((medication) => ({ medication: medication.trim() })),
            familyHistory,
            currentlyEmployed,
            currentlyInsured,
            icdHealthCodes: code.split(",").map((code) => ({ code: code.trim() })),
            allergies: allergy.split(",").map((allergy) => ({ allergy: allergy.trim() })),
            visits: [{ currentDose, dateTime, notes, hivViralLoad }],
        };
        const addPatientResponse = await entities.patient.add(newPatient);
        console.log(addPatientResponse);
        setLoading(false);
        setPatients([...patients, newPatient]);
        setName('');
        setPatientPicture('');
        setDob('');
        setInsuranceNumber('');
        setHeight('');
        setWeight('');
        setBloodPressure('');
        setBloodType('');
        setTemperature('');
        setOxygenSaturation('');
        setUuid('');
        setAddress('');
        setCurrentMedications([]);
        setMedication('');
        setIcdCodes('');
        setAllergy('');
        setDateTime('');
        setNotes('');
        setHivViralLoad('');
        setFamilyHistory('');
        setCurrentlyEmployed('');
        setCurrentlyInsured('');
        setIcdHealthCodes([]);
        setAllergies([]);
        setVisits([]);
        navigate('/doctor/janehopkinspage');
    };

    const handleName = (event) => {
        setName(event.target.value);
    };
    const handlePatientPicture = (event) => {
        setPatientPicture(event.target.value);
    };
    const handleDob = (event) => {
        setDob(event.target.value);
    };
    const handleInsuranceNumber = (event) => {
        setInsuranceNumber(event.target.value);
    };
    const handleHeight = (event) => {
        setHeight(event.target.value);
    };
    const handleWeight = (event) => {
        setWeight(event.target.value);
    };
    const handleBloodPressure = (event) => {
        setBloodPressure(event.target.value);
    };
    const handleBloodType = (event) => {
        setBloodType(event.target.value);
    }
    const handleTemperature = (event) => {
        setTemperature(event.target.value);
    };
    const handleOxygenSaturation = (event) => {
        setOxygenSaturation(event.target.value);
    };
    const handleUuid = (event) => {
        setUuid(event.target.value);
    };
    const handleAddress = (event) => {
        setAddress(event.target.value);
    };
    const handleMedication = (event) => {
        setMedication(event.target.value); // update medication state with user input
    };
    const handleFamilyHistory = (event) => {
        setFamilyHistory(event.target.value);
    };
    const handleCurrentlyEmployed = (event) => {
        const value = event.target.checked ? "Yes" : "No";
        setCurrentlyEmployed(value);
    };
    const handleCurrentlyInsured = (event) => {
        const value = event.target.checked ? "Yes" : "No";
        setCurrentlyInsured(value);
    };
    const handleIcdCodes = (event) => {
        setIcdCodes(event.target.value);
    };
    const handleAllergy = (event) => {
        setAllergy(event.target.value);
    };
    const handleDate = (event) => {
        setDate(event.target.value);
        handleDateTime(event.target.value, time);
    };

    const handleTime = (event) => {
        setTime(event.target.value);
        handleDateTime(date, event.target.value);
    };

    const handleDateTime = (dateString, timeString) => {
        console.log(dateString, timeString);
        const dateTime = new Date(`${dateString} ${timeString}`);

        const formattedDate = dateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const formattedTime = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        setDateTime(formattedDateTime);
    };
    const handleNotes = (event) => {
        setNotes(event.target.value);
    };
    const handleHivViralLoad = (event) => {
        setHivViralLoad(event.target.value);
    };
    const today = new Date().toISOString().substr(0, 10);

    return (
        <>
            <div classname="patient-background">
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
                        <Link underline="hover" href={"/doctor/janehopkinspage/addpatient"}>Add Patient</Link>
                    </Breadcrumbs>
                </Box>
            </div>
            <div className="patient">
                <div className="something">
                    <div className="patient-container">
                        <Paper className="patient-top">
                            <Stack direction="row" alignItems="center">
                                <div>
                                    <Avatar
                                        src={patientPicture}
                                        alt={name}
                                        sx={{ width: 100, height: 100, bgcolor: pink[500], marginRight: '0.5rem', marginLeft: "3rem" }}
                                    />
                                    <div style={{ paddingRight: "1rem" }}>
                                        <input
                                            type="string"
                                            placeholder="Patient Picture Link"
                                            value={patientPicture}
                                            onChange={handlePatientPicture}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Name: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={handleName}
                                            /></span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        DOB: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="MM/DD/YYYY"
                                                value={dob}
                                                onChange={handleDob}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Insurance #: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="Insurance Number"
                                                value={insuranceNumber}
                                                onChange={handleInsuranceNumber}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Address: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="123 Main St, Anytown CA"
                                                value={address}
                                                onChange={handleAddress}
                                            />
                                        </span>
                                    </Typography>
                                </div>
                            </Stack>
                        </Paper>
                    </div>

                    <div className="patient-left-right">
                        <div className="patient-left">
                            <Paper className="patient-bottom-info">
                                <Stack>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Patient ID: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="12234-535675a-24553fw5"
                                                value={uuid}
                                                onChange={handleUuid}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        ICD Health Codes: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="E11.9, I25.10, ..."
                                                value={code}
                                                onChange={handleIcdCodes}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Allergies: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="peanut, apples, ..."
                                                value={allergy}
                                                onChange={handleAllergy}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Current Medications: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="tylenol, benadryl"
                                                value={medication}
                                                onChange={handleMedication}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Height: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="5'11&quot;"
                                                value={height}
                                                onChange={handleHeight}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Weight: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="100 lbs"
                                                value={weight}
                                                onChange={handleWeight}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Blood Pressure: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="120/70 mmHg"
                                                value={bloodPressure}
                                                onChange={handleBloodPressure}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Blood Type: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <select id="bloodType" value={bloodType} onChange={handleBloodType}>
                                                <option value="">Select Blood Type</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Temperature: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="98.9 F"
                                                value={temperature}
                                                onChange={handleTemperature}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Oxygen Saturation: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="99%"
                                                value={oxygenSaturation}
                                                onChange={handleOxygenSaturation}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Family History: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            <input
                                                type="string"
                                                placeholder="Heart Disease, ..."
                                                value={familyHistory}
                                                onChange={handleFamilyHistory}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Currently Employed: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            (Check if Yes)<Checkbox
                                                type="checkbox"
                                                checked={currentlyEmployed === "Yes"}
                                                onChange={handleCurrentlyEmployed}
                                            />
                                        </span>
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        Currently Insured: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                            (Check if Yes)<Checkbox
                                                type="checkbox"
                                                checked={currentlyInsured === "Yes"}
                                                onChange={handleCurrentlyInsured}
                                            />
                                        </span>
                                    </Typography>
                                </Stack>
                            </Paper>
                        </div>
                        <div className="patient-middle">
                            <Paper className="patient-bottom-info">
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                    Visits: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                                        <br />
                                        Date: <input type="date" value={date} onChange={handleDate} />
                                        <br />
                                        Time: <input type="time" value={time} onChange={handleTime} />                                        <br /> Notes: <input className="Notes" type="string" placeholder="Notes" value={notes} onChange={handleNotes} />
                                        <br /> HIV Viral Load: <input type="string" placeholder="HIV Viral Load" value={hivViralLoad} onChange={handleHivViralLoad} />
                                    </span>
                                </Typography>
                            </Paper>
                        </div>

                        <div className="patient-right">
                            <Paper className="patient-hiv-info">
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem', paddingBottom: '1rem' }}>Trial: N/A</Typography>
                                <div className="dose-container">
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Completed Dose(s): N/A</Typography>
                                </div>
                                <Typography><br /><Button variant="contained" onClick={() => { addPatient() }}>Add Patient</Button></Typography>
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

export default AddPatient;