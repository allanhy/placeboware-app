import "./styles/App.css";
import Login from './pages/Login';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import FDAPage from './pages/FDAPage';
import FDADrug from "./pages/FDADrug";
import BavariaPage from './pages/BavariaPage';
import BavariaDrug from "./pages/BavariaDrug";
import JaneHopkinsPage from './pages/JaneHopkinsPage';
import DoctorPage from './pages/DoctorPage';
import Appointment from './pages/Appointment';
import Patient from './pages/Patient';
import AddPatient from './pages/AddPatient';
import AddDrug from "./pages/AddDrug";
import DoseInfo from './pages/DoseInfo';
import PatientDrView from './pages/PatientDrView';
import ResultsPage from "./pages/ResultsPage";
import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import {
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase-config";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return authListener;
  }, []);

  const adminJaneHopkins = user && user.email.endsWith('@admin.janehopkins.org');
  const doctorJaneHopkins = user && user.email.endsWith('@doctor.janehopkins.org');
  const fda = user && user.email.endsWith('@fda.gov');
  const bavaria = user && user.email.endsWith('@bavaria.org');
  // After successful login
  sessionStorage.setItem('loggedIn', true);

  // When the app loads
  const isLoggedIn = sessionStorage.getItem('loggedIn');

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <>
              {fda && (
                <>
                 <Route path="/fdapage" element={<FDAPage />} />
                 <Route path="/fdapage/drug/:id" exact element={<FDADrug />} />
                 <Route path="/fdapage/results/:id" exact element={<ResultsPage />} />

                </>
              )}
              {bavaria && (
                <>
                 <Route path="/bavariapage" element={<BavariaPage />} />
                 <Route path="/bavariapage/drug/:id" exact element={<BavariaDrug />} />
                 <Route path="/bavariapage/adddrug" exact element={<AddDrug />} />
                 <Route path="/bavariapage/results/:id" exact element={<ResultsPage />} />
                </>
              )}
              {doctorJaneHopkins && (
                <>
                  <Route path="/doctor/janehopkinspage" element={<DoctorPage />} />
                  <Route path="/doctor/janehopkinspage/patient/:uuid" exact element={<PatientDrView />} />
                  <Route path="/doctor/janehopkinspage/patient/:uuid/setAppointment" exact element={<Appointment />} />
                  <Route path="/doctor/janehopkinspage/patient/:uuid/doseInfo" exact element={<DoseInfo />} />
                  <Route path="/doctor/janehopkinspage/addpatient" element={<AddPatient />} />
                </>
              )}
              {adminJaneHopkins && (
                <>
                  <Route path="/admin/janehopkinspage" element={<JaneHopkinsPage />} />
                  <Route path="/admin/janehopkinspage/patient/:uuid" exact element={<Patient />} />
                </>
              )}
              {!doctorJaneHopkins && adminJaneHopkins && (
                <Route path="/doctor/*" element={<Navigate to="/" />} />
              )}
              {!doctorJaneHopkins && fda && (
                <Route path="/doctor/*" element={<Navigate to="/" />} />
              )}
              {!doctorJaneHopkins && bavaria && (
                <Route path="/doctor/*" element={<Navigate to="/" />} />
              )}
              {doctorJaneHopkins && !adminJaneHopkins &&  (
                <Route path="/admin/*" element={<Navigate to="/" />} />
              )}
              {fda && !adminJaneHopkins &&  (
                <Route path="/admin/*" element={<Navigate to="/" />} />
              )}
              {bavaria && !adminJaneHopkins &&  (
                <Route path="/admin/*" element={<Navigate to="/" />} />
              )}
              {!bavaria && fda && (
                <Route path="/bavariapage/*" element={<Navigate to="/" />} />
              )}
              {!bavaria && doctorJaneHopkins && (
                <Route path="/bavariapage/*" element={<Navigate to="/" />} />
              )}
              {!bavaria && adminJaneHopkins && (
                <Route path="/bavariapage/*" element={<Navigate to="/" />} />
              )}
              {!fda && bavaria && (
                <Route path="/fdapage/*" element={<Navigate to="/" />} />
              )}
              {!fda && doctorJaneHopkins && (
                <Route path="/fdapage/*" element={<Navigate to="/" />} />
              )}
              {!fda && adminJaneHopkins && (
                <Route path="/fdapage/*" element={<Navigate to="/" />} />
              )}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
          <Route exact path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>  
      {loading && <div className="LoadingOverlay">
                <CircularProgress />
      </div>}    
    </div>
      
  );
}

export default App;
