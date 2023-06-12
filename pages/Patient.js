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
  Checkbox
}
  from "@mui/material";
import { Logout, Save, Edit, Menu } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { pink, blue } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import "../styles/Patient.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useJaneHopkins from "../hooks/useJaneHopkins";

const Patient = () => {
  const { uuid } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { entities } = useJaneHopkins();
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const latestVisit = patients.visits?.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0];

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  useEffect(() => {
    // Simulating the loading process
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, []);

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

  const handleAppointment = () => {
    navigate('/admin/janehopkinspage/patient/' + uuid + '/setAppointment')
  };

  const handleDoseInfo = () => {
    navigate('/admin/janehopkinspage/patient/' + uuid + '/doseInfo')
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
        placebo: patientEntity.placebo,
        drugName: patientEntity.drugName
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
    const updatedPatient = await entities.patient.update({
      _id: patientEntity._id,
      name: patients.name,
      dob: patients.dob,
      insuranceNumber: patients.insuranceNumber,
      height: patients.height,
      weight: patients.weight,
      bloodPressure: patients.bloodPressure,
      bloodType: patients.bloodType,
      temperature: patients.temperature,
      oxygenSaturation: patients.oxygenSaturation,
      uuid: patients.uuid,
      address: patients.address,
      currentMedications: patients.currentMedications,
      familyHistory: patients.familyHistory,
      currentlyEmployed: patients.currentlyEmployed,
      currentlyInsured: patients.currentlyInsured,
      icdHealthCodes: patients.icdHealthCodes,
      allergies: patients.allergies,
      visits: patients.visits,
    });
    setLoading(false);
    console.log(updatedPatient);
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
              <Button variant="h2" href="/admin/janehopkinspage">Home</Button>
            </Typography>

            <Stack direction='row' spacing={2}>
              <div className="profile"><Avatar sx={{ bgcolor: blue[500] }} onClick={handleClick}>AD</Avatar></div>
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
                  <Avatar sx={{ bgcolor: blue[500] }}>AD</Avatar>
                  <Box ml={1}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Logged in as Jane Hopkins
                    </Typography>
                    <Typography variant="body2">{user.email} <span style={{ fontSize: '0.7rem' }}> (Admin)</span></Typography>
                  </Box>
                </Box>
                <div className="submenu"><Box bgcolor="rgba(0,0,0,0.1)" p={2} flexGrow={1} borderTop="1px solid rgba(0, 0, 0, 0.2)" onClick={handleLogout}>
                  Doctor View
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
            <Link underline="hover" href='/admin/janehopkinspage'>Home</Link>
            <Link underline="hover" href={"/admin/janehopkinspage/patient/" + uuid}>Patient Info</Link>
          </Breadcrumbs>
        </Box>
      </div>

      <div className="patient">
        <div className="something">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', paddingBottom: '1rem' }}>Patient: {patients.name}
              <IconButton onClick={isEditing ? handleSaveClick : handleEditClick} aria-label="Save">
                {isEditing ? <Save /> : <Edit />}
              </IconButton>
            </span>
          </div>
          <div className="patient-container">
            <Paper className="patient-top">
              <Stack direction="row" alignItems="center">
                {isEditing ? (
                  <>
                    <Avatar src={patients.patientPicture} alt={patients.name} sx={{ width: 100, height: 100, bgcolor: pink[500], marginRight: '0.5rem' }}></Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Name: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="Full Name"
                            value={patients.name}
                            onChange={(e) =>
                              setPatients({ ...patients, name: e.target.value })
                            }
                          /></span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        DOB: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="MM/DD/YYYY"
                            value={patients.dob}
                            onChange={(e) =>
                              setPatients({ ...patients, dob: e.target.value })
                            }
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Insurance #: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="Insurance Number"
                            value={patients.insuranceNumber}
                            onChange={(e) =>
                              setPatients({ ...patients, insuranceNumber: e.target.value })
                            }
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Address: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="123 Main St, Anytown CA"
                            value={patients.address}
                            onChange={(e) =>
                              setPatients({ ...patients, address: e.target.value })
                            }
                          />
                        </span>
                      </Typography>
                    </div>
                  </>
                ) : (
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
                )}
              </Stack>
            </Paper>
          </div>
          <div className="patient-left-right">
            <div className="patient-left">
              <Paper className="patient-bottom-info">
                <Stack>
                  {isEditing ? (
                    <>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Patient ID: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          {patients.uuid}
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        ICD Health Codes: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="E11.9, I25.10, ..."
                            value={patients.icdHealthCodes?.map(code => code.code).join(', ')}
                            onChange={(e) => {
                              const codeStrings = e.target.value.split(',').map(s => s.trim());
                              const icdHealthCodes = codeStrings.map(code => ({ code }));
                              setPatients({ ...patients, icdHealthCodes });
                            }}
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Allergies: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="peanut, apples, ..."
                            value={patients.allergies?.map(allergy => allergy.allergy).join(', ')}
                            onChange={(e) => {
                              const allergyStrings = e.target.value.split(',').map(s => s.trim());
                              const allergies = allergyStrings.map(allergy => ({ allergy }));
                              setPatients({ ...patients, allergies });
                            }}
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Address: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="123 Main St, Anytown CA"
                            value={patients.address}
                            onChange={(e) =>
                              setPatients({ ...patients, address: e.target.value })
                            }
                          />
                        </span>
                      </Typography>
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
                        Blood Type: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          {patients.bloodType}
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
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Family History: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          <input
                            type="string"
                            placeholder="Heart Disease, ..."
                            value={patients.familyHistory}
                            onChange={(e) =>
                              setPatients({ ...patients, familyHistory: e.target.value })
                            }
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Currently Employed: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          (Check if Yes)<Checkbox
                            type="checkbox"
                            checked={patients.currentlyEmployed === "Yes"}
                            onChange={(e) =>
                              setPatients({ ...patients, currentlyEmployed: e.target.checked ? "Yes" : "No" })
                            }
                          />
                        </span>
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Currently Insured: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                          (Check if Yes)<Checkbox
                            type="checkbox"
                            checked={patients.currentlyInsured === "Yes"}
                            onChange={(e) =>
                              setPatients({ ...patients, currentlyInsured: e.target.checked ? "Yes" : "No" })
                            }
                          />
                        </span>
                      </Typography>
                    </>
                  ) : (
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
                  )}
                </Stack>
              </Paper>
            </div>
            <div className="patient-middle">
              <Paper className="patient-bottom-info">
                <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                  Visits: <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                    {patients.visits?.map((visit, index) => (
                      <React.Fragment key={index}>
                        <br /> Current Dose: {visit.currentDose}
                        <br />Date and Time: {visit.dateTime}
                        <br />General Notes: {visit.notes || <span style={{ fontStyle: 'italic' }}>Pending...</span>}
                        <br />HIV Viral Load: {visit.hivViralLoad || <span style={{ fontStyle: 'italic' }}>Pending...</span>}<br />
                      </React.Fragment>
                    ))} </span>
                </Typography>
              </Paper>
            </div>



            <div className="patient-right">
              {patients.completedDoses !== null ? (
                <Paper className="patient-hiv-info">
                  <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem', paddingBottom: '1rem' }}>Trial: {patients.drugName}</Typography>
                  <div className="dose-container">
                    <Typography style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Completed Dose(s): {patients.completedDoses} / 5</Typography>
                  </div>
                  {(parseInt(patients.completedDoses) === 0) && !latestVisit ? (
                    <Typography>
                      <br></br>
                      <span style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>Set Appointment: </span><br />
                      <Button variant="contained" onClick={handleAppointment} disabled>
                        Set Appointment</Button>
                    </Typography>
                  ) : (
                    <>
                      <Typography style={{ padding: '1rem' }}>
                        <Button variant="contained" onClick={handleDoseInfo} disabled>
                          Dose #{latestVisit && (latestVisit.currentDose)} Info</Button></Typography>
                      <Typography>
                        <Typography style={{ paddingBottom: "1rem" }}></Typography>
                        <span style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>Next Appointment: </span><br />
                        {latestVisit && (
                          <>
                            {latestVisit.notes && latestVisit.hivViralLoad ? (
                              "Schedule the next appointment below"
                            ) : (
                              <>
                                <span style={{ fontSize: '1.1rem' }}>{latestVisit.dateTime.split(' ')[0]} <br /></span>
                                @ <br />
                                <span style={{ fontSize: '1.1rem' }}>{latestVisit.dateTime.split(' ')[1] + ' ' + latestVisit.dateTime.split(' ')[2]} </span><br />
                              </>
                            )}
                          </>
                        )}
                        <Typography></Typography>
                        <Button variant="contained" onClick={handleAppointment} disabled>
                          Set Appointment</Button>
                      </Typography>
                      <Typography style={{ paddingBottom: "2rem" }}></Typography>
                      {!isLoaded ? (
                        <Typography style={{ fontWeight: 'bold', fontSize: '1.2rem', fontStyle: 'italic' }}>Loading...</Typography>
                      ) : (
                        <>
                          {patients.placebo === null ? (
                            <div className="results">
                              <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                Results of Trial → N/A
                              </Typography>
                            </div>
                          ) : (
                            <div className="results">
                              <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                                Results of Trial → Placebo: {patients.placebo ? 'Yes' : 'No'}
                              </Typography>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Paper>
              ) : (
                <Paper className="patient-hiv-info">
                  <Typography style={{ fontWeight: 'bold', fontSize: '1.4rem', paddingBottom: '1rem' }}>Trial: <span style={{ fontStyle: 'italic' }}>Pending...</span></Typography>
                  <div className="dose-container">
                    <Typography style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Completed Dose(s): N/A</Typography>
                  </div>
                </Paper>
              )}
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

export default Patient;