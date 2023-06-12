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
    Checkbox,
    TextField,
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

const Appointment = () => {
    const { uuid } = useParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const { entities } = useJaneHopkins();
    const [patients, setPatients] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [visits, setVisits] = useState([]);
    const [dose, setDose] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [dateTime, setDateTime] = useState("");
    const open = Boolean(anchorEl);
    const latestVisit = patients.visits?.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0];
    const [isReadyForNextDose, setIsReadyForNextDose] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

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

    const handleDose = (event) => {
        setDose(event.target.value);
    }

    useEffect(() => {
        const getPatient = async () => {
            setLoading(true);
            const patientEntity = await entities.patient.get(uuid);
            console.log(patientEntity);
            const patientData = {
                name: patientEntity.name,
                patientPicture: patientEntity.patientPicture,
                dob: patientEntity.dob,
                insuranceNumber: patientEntity.insuranceNumber,
                uuid: patientEntity.uuid,
                address: patientEntity.address,
                visits: patientEntity.visits,
                completedDoses: patientEntity.completedDoses
            };
            setPatients(patientData);
            setLoading(false);
        };
        getPatient();
    }, [entities.patient]);

    const handleSaveClick = async () => {
        setIsEditing(false);
        setLoading(true);
        const patientEntity = await entities.patient.get(uuid);
        let currentDose = isReadyForNextDose && !latestVisit
            ? "1"
            : isReadyForNextDose
                ? (parseInt(latestVisit.currentDose) + 1).toString()
                : latestVisit?.currentDose ?? "0";
        const newVisit = {
            dateTime: dateTime,
            notes: "",
            hivViralLoad: "",
            currentDose: currentDose,
        };

        const updatedPatient = await entities.patient.update({
            _id: patientEntity._id,
            uuid: patients.uuid,
            visits: patients.visits && Array.isArray(patients.visits) ? [...patients.visits, newVisit] : [newVisit],
            completedDoses: patients.completedDoses,
        });
        setLoading(false);
        console.log(updatedPatient);
        navigate("/doctor/janehopkinspage/patient/" + uuid);
    };

    return (
        <>
            <div className="patient-background">
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
                        <Link underline="hover" href={"/doctor/janehopkinspage/patient/" + uuid}>Patient Info</Link>
                        <Link underline="hover" href={"/doctor/janehopkinspage/patient/" + uuid + "/setAppointment"}>Set Appointment</Link>
                    </Breadcrumbs>
                </Box>
            </div>

            <div className="patient">
                <div className="something">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px', paddingBottom: '1rem' }}>Set Appointment

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
                                        <Typography><br /></Typography>
                                        {!latestVisit ? (
                                            <Typography></Typography>
                                        ) : (
                                            <div className="dose-container">
                                                <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {latestVisit && (
                                                        <React.Fragment>
                                                            Current Dose: #{latestVisit.currentDose}
                                                            <br />Date: {latestVisit.dateTime.split(' ')[0]} <br />Time: {latestVisit.dateTime.split(' ')[1] + ' ' + latestVisit.dateTime.split(' ')[2]}<br />
                                                        </React.Fragment>
                                                    )}
                                                </Typography>
                                            </div>
                                        )}
                                    </div>
                                </>
                            </Stack>
                        </Paper>
                    </div>

                    <div className="patient-left-right">
                        <div className="patient-appointment">
                            <Paper className="patient-add-appointment">
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                    Ready for Next Dose: <Checkbox
                                        type="checkbox"
                                        checked={isReadyForNextDose}
                                        onChange={(e) => {
                                            setIsReadyForNextDose(e.target.checked);
                                        }}
                                    />
                                    <br />
                                    <br />
                                    Date: <input type="date" value={date} onChange={handleDate} />
                                    <br />
                                    Time: <input type="time" value={time} onChange={handleTime} />
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