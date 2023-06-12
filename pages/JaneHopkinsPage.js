import React, { useState, useEffect } from "react";
import "../styles/JaneHopkinsPage.css";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { pink, blue } from "@mui/material/colors";
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
  TextField,
  CircularProgress,
  Checkbox,
  Popover,
  Badge,
  List,
  Divider
}
  from "@mui/material";
import { Notifications, Logout, Search, MoreVert, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useJaneHopkins from "../hooks/useJaneHopkins";

function JaneHopkinsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { entities } = useJaneHopkins();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [excludeDOB, setExcludeDOB] = useState(false);
  const [excludeIcd, setExcludeIcd] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [completedPatients, setCompletedPatients] = useState([]);
  // eslint-disable-next-line
  const [releasedResult, setReleasedResults] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sendToFDA, setSendToFDA] = useState(null);

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

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  useEffect(() => {
    const getPatients = async () => {
      setLoading(true); // set loading state to true
      const patientEntities = await entities.patient.list();
      const patientData = patientEntities.items.map((patient) => ({
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
        placebo: patient.placebo,
      }));
      setPatients(patientData);
      setLoading(false); // set loading state to false
      const newCompletedPatients = patientData.filter((patient) => parseInt(patient.completedDoses) === 5);
      const releasedResult = patientData.filter((patient) => patient.placebo !== null && patient.placebo !== undefined)
        .map((patient) => patient.placebo);
      setCompletedPatients(newCompletedPatients);
      setReleasedResults(releasedResult);
    };
    getPatients();
  }, [entities.patient]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!excludeDOB || new Date(patient.dob) < new Date('2005-01-01')) &&
        (!excludeIcd || !excludeIcd.split(/[,\s]+/).filter(code => code !== '').some(code => patient.icdHealthCodes.some(icdCode => icdCode.code.toLowerCase() === code.toLowerCase())))
      )
    );
  }, [searchQuery, excludeDOB, excludeIcd, patients]);

  const handleFilters = () => {
    setFiltersOpen(!filtersOpen);
    setExcludeDOB(!filtersOpen);
    setExcludeIcd((prevExcludeIcd) => {
      if (!prevExcludeIcd) {
        return '';
      }
      return prevExcludeIcd
        .split(',')
        .map((code) => code.trim())
        .filter((code) => !code.toLowerCase().includes(excludeIcd.toLowerCase()))
        .join(', ');
    });
  };

  const allPatientsSelected = () => {
    return filteredPatients.length === selectedPatients.length;
  };

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleMarkEligible = async () => {
    setLoading(true);
    const updatedPatients = await Promise.all(selectedPatients.map(async (patientId) => {
      const updatedPatient = await entities.patient.update({
        _id: patientId,
        eligible: 'Yes',
      });
      return updatedPatient;
    }));
    setFilteredPatients(prevState => prevState.map(patient => {
      const updatedPatient = updatedPatients.find(p => p._id === patient._id);
      if (updatedPatient) {
        return updatedPatient;
      }
      return patient;
    }));
    console.log(updatedPatients);
    setSelectedPatients([]);
    window.location.reload();
  }

  const handleMoreOptionsClick = (event, patientId) => {
    setSelectedPatientId(patientId);
    setSendToFDA(event.currentTarget);
  };

  const handleMoreOptionsClickClose = () => {
    setSendToFDA(null);
  };

  const getPatientData = async (patientId) => {
    const patient = await entities.patient.get(patientId, {
      aclInput: {
        acl: [
          {
            principal: {
              nodes: ["fda"]
            },
            operations: ["READ"]
          }
        ],
      },
    });
    const patientData = {
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
    };
    return patientData;
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
            </Typography>

            <Stack direction="row" spacing={2}>
              <div className="profile">
                <Badge badgeContent={completedPatients.length} color="primary" sx={{ marginTop: '0.5rem', marginRight: '1rem' }} onClick={handleNotificationClick}>
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
                  {(completedPatients.length > 0) ? (
                    completedPatients.map((patient, index) => (
                      <React.Fragment key={patient._id}>
                        {(patient.placebo === true || patient.placebo === false) ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '5px solid rgb(0, 216, 0)', bgcolor: 'grey.100', p: 2, mb: index !== completedPatients.length - 1 ? 1 : 0, width: '320px' }}>
                            <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: pink[500], mr: 2 }} />
                            <Typography sx={{ flexGrow: 1, fontSize: '1rem' }}>{patient.name} has released results.</Typography>
                            <IconButton aria-label="options" size="small" onClick={(event) => handleMoreOptionsClick(event, patient._id)}>
                              <MoreVert />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderLeft: '5px solid rgb(173, 216, 230)',
                              bgcolor: 'grey.100',
                              p: 2,
                              mb: index !== completedPatients.length - 1 ? 1 : 0, width: '320px'
                            }}>
                            <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: pink[500], mr: 2 }} />
                            <Typography sx={{ flexGrow: 1, fontSize: '1rem' }}>{patient.name} has completed 5 doses.</Typography>
                            <IconButton aria-label="options" size="small" onClick={(event) => handleMoreOptionsClick(event, patient._id)}>
                              <MoreVert />
                            </IconButton>
                            <Popover
                              open={sendToFDA}
                              anchorEl={sendToFDA}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                              }}
                              onClose={handleMoreOptionsClickClose}
                            >
                              <Button onClick={async () => {
                                const patientData = await getPatientData(selectedPatientId);
                                const response = await fetch('https://5363ui0nhg.execute-api.us-west-2.amazonaws.com/graphql/', {
                                  method: 'POST',
                                  body: JSON.stringify(patientData),
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                });
                                const data = await response.json();
                                // handle response data
                                console.log(data);
                              }}>
                                Send to FDA
                              </Button>
                            </Popover>
                          </Box>
                        )}

                        {index !== completedPatients.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 2, width: '320px' }}>
                      No New Notifications
                    </Box>
                  )}
                </List>
              </Popover>


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
                    <Typography variant="body2">{user?.email} <span style={{ fontSize: '0.7rem' }}> (Admin)</span></Typography>
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

      <div className="JaneHopkinsPage">
        <Paper>
          <TableContainer sx={{ maxHeight: '500px' }}>
            <TableRow sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <TableCell>
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                  Total Patients:
                </Typography>
                <br />
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                  {patients.filter(patient => patient.eligible === 'Yes' && patient.completedDoses >= 0 && patient.completedDoses <= 5).length}                                                        </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                  Ongoing Trials:
                </Typography>
                <br />
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                  {patients.filter(patient => patient.currentDrug && patient.completedDoses >= 0 && patient.completedDoses <= 4).length}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
                  Completed Trials:
                </Typography>
                <br />
                <Typography variant="h6" style={{ display: 'inline-block', marginRight: '10px', color: 'black' }}>
                  {completedPatients.length}                                                        </Typography>
              </TableCell>
            </TableRow>
          </TableContainer>
        </Paper>

        <br />
        <Paper>
          <TableContainer sx={{ maxHeight: '500px' }}>
            <TableRow>
              <TableCell sx={{ width: '90%' }}>
                <Search sx={{ paddingRight: ".7rem", paddingTop: "0.75rem", paddingLeft: "0.5rem", fontSize: "2rem", display: { xs: 'none', md: 'inline-flex' } }} />
                <TextField
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 'auto' }}
                />
              </TableCell>
              <TableCell>
                <Button variant="contained" onClick={handleFilters} color="primary">
                  {filtersOpen ? 'Close Filters' : 'Open Filters'}
                </Button>
              </TableCell>
            </TableRow>
          </TableContainer>
          {filtersOpen && (
            <TableContainer sx={{ maxHeight: '500px' }}>
              <Table>
                <TableBody>
                  <TableRow sx={{ bgcolor: "rgba(0,0,0,0.1)", borderTop: "1px solid rgba(0, 0, 0, 0.2)" }}>
                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption">Exclude Patients with DOB over 2005:</Typography>
                      <Checkbox
                        checked={excludeDOB}
                        onChange={(e) => setExcludeDOB(e.target.checked)}
                      />
                    </TableCell>
                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: { xs: 2, md: 0 } }}>
                      <Typography variant="caption">Exclude ICD Codes:</Typography>
                      <TextField
                        value={excludeIcd}
                        placeholder="ICD Health Code"
                        onChange={(e) => setExcludeIcd(e.target.value)}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: { xs: 2, md: 0 } }}>
                      <Button
                        variant="contained"
                        disabled={selectedPatients.length === 0}
                        onClick={handleMarkEligible}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                      >
                        Mark Eligible
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </div>

      <div className="JaneHopkinsPage-body">
        <Paper>
          <TableContainer sx={{ maxHeight: '550px' }}>
            <Table aria-label='simple-table' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox
                    checked={allPatientsSelected()}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedPatients(isChecked ? filteredPatients.map(patient => patient._id) : []);
                    }}
                  /></TableCell>
                  <TableCell></TableCell>
                  <TableCell>ID Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>ICD Codes</TableCell>
                  <TableCell>Eligible?</TableCell>
                  <TableCell>Completed Doses</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <TableCell><span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading Patient Data... </span><br /></TableCell>
              ) : (
                <TableBody>
                  {filteredPatients.map((patient, index) => (
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
                        <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: pink[500] }}></Avatar>
                      </TableCell>

                      <TableCell><Button variant="string" href={"/admin/janehopkinspage/patient/" + patient._id}>
                        {patient.uuid}
                      </Button></TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.dob}</TableCell>
                      <TableCell>{patient.icdHealthCodes?.map((code, index) => (
                        <React.Fragment key={index}>
                          {code.code}
                          {index < patient.icdHealthCodes.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}</TableCell>
                      <TableCell> {patient.eligible === 'Yes' ? '✔️' : '❌'}</TableCell>
                      <TableCell>{patient.completedDoses} / 5</TableCell>

                    </TableRow>
                  ))
                  }
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>
        {loading && <div className="LoadingOverlay">
          <CircularProgress />
        </div>}
      </div>
    </>
  );
}
export default JaneHopkinsPage;
