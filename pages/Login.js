import "../styles/Login.css";
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Avatar,
  CssBaseline,
  Paper,
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { auth } from "../firebase-config";
import { Navigate } from 'react-router-dom';
import { CircularProgress } from "@mui/material";

const theme = createTheme();

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // eslint-disable-next-line
  const [user, setUser] = useState({});
  const [redirectTo, setRedirectTo] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = createTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const login = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      // Get the domain of the email address
      const domain = loginEmail.split('@')[1];
      // Redirect the user to the appropriate page based on their email domain
      switch (domain) {
        case 'fda.gov':
          setRedirectTo('/fdapage');
          break;
        case 'bavaria.org':
          setRedirectTo('/bavariapage');
          break;
        case 'admin.janehopkins.org':
          setRedirectTo('/admin/janehopkinspage');
          break;
        default:
          setRedirectTo('/doctor/janehopkinspage');
          break;
      }
      console.log(user);
    } catch (error) {
      console.log(error.message);
      setErrorMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
      <div className="Login">
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(https://resources.nejmcareercenter.org/wp-content/uploads/MedicalStaffByLawsRulesRegs.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: "100vh"
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  paddingTop: "9rem",
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Pharma Studies Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={login} sx={{ mt: 1 }} >
                  <div>
                    <input
                      className='InputBox'
                      placeholder="Email..."
                      onChange={(event) => {
                        setLoginEmail(event.target.value);
                      }}
                    />
                    <br />
                    <input
                      className='InputBox'
                      placeholder="Password..."
                      type={'password'}
                      onChange={(event) => {
                        setLoginPassword(event.target.value);
                      }}
                    />
                    <br />
                    {errorMessage && <h3 style={{ color: "red", textAlign: 'center' }}>{errorMessage}</h3>}
                    <button className="Button" onClick={login}> Login</button>
                  </div>
                  <Grid container>
                    <Grid item xs>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
        {loading && <div className="LoadingOverlay">
          <CircularProgress />
        </div>}
        <br />
      </div>
    </>
  );
}

export default Login;