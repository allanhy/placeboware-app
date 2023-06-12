import React, { useState, useEffect } from "react";
import "../styles/JaneHopkinsPage.css";
import Button from "@mui/material/Button";
import ToolBar from "@mui/material/Toolbar/Toolbar";
import { pink, purple } from "@mui/material/colors";
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
  Popover,
}
  from "@mui/material";
import { Search, Logout, Menu } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import useJaneHopkins from "../hooks/useJaneHopkins";

function DoctorPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { entities } = useJaneHopkins();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
      }));
      setPatients(patientData);
      setLoading(false); // set loading state to false
    };
    getPatients();
  }, [entities.patient]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, patients]);

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

      <div className="JaneHopkinsPage">
        <Paper>
          <TableContainer sx={{ maxHeight: '500px' }}>
            <TableRow>
              <TableCell style={{ width: '89%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Search sx={{ paddingRight: ".7rem", paddingTop: "0.75rem", paddingLeft: "0.5rem", fontSize: "2rem", display: { xs: 'none', sm: 'block' } }} />
                  <TextField
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 'auto' }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableContainer>
        </Paper>
      </div>

      <div className="JaneHopkinsPage-body">
        <Paper>
          <TableContainer sx={{ maxHeight: '550px' }}>
            <Table aria-label='simple-table' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><Button variant="contained" color="primary" href={"/doctor/janehopkinspage/addpatient"}>
                    +
                  </Button></TableCell>
                  <TableCell>ID Number</TableCell>
                  <TableCell>First name</TableCell>
                  <TableCell>Last name</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>ICD Codes</TableCell>
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
                      }}><TableCell>
                        <Avatar src={patient.patientPicture} alt={patient.name} sx={{ bgcolor: pink[500] }}></Avatar>
                      </TableCell>

                      <TableCell><Button variant="string" href={"/doctor/janehopkinspage/patient/" + patient._id}>
                        {patient.uuid}
                      </Button></TableCell>
                      <TableCell>{patient.name.split(' ')[0]}</TableCell>
                      <TableCell>{patient.name.split(' ').slice(1).join(' ')} </TableCell>
                      <TableCell>{patient.dob}</TableCell>
                      <TableCell>{patient.icdHealthCodes?.map((code, index) => (
                        <React.Fragment key={index}>
                          {code.code}
                          {index < patient.icdHealthCodes.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}</TableCell>
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
export default DoctorPage;
