import './styles/App.css';
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Map from './pages/Map.jsx';
import IssueForm from './pages/IssueForm.jsx';
import Profile from "./components/profile";
import Login from "./components/login";
import SignUp from "./components/register";
import { useEffect, useState } from 'react';
import { auth } from './components/firebase.jsx';
import { CssBaseline } from '@mui/material';

function App() {

  const [user, setUser] = useState();
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<Map />} />
              <Route path="/issuedetails" element={<IssueDetails />} />
              <Route path="/issueform" element={<IssueForm />} />
              {user && <Route path="/profile" element={<Profile />} />}
              {!user && <Route path="/login" element={<Login />} />}
              {!user && <Route path="/register" element={<SignUp />} />}
            </Routes>
            <ToastContainer 
              newestOnTop
            />
            <CssBaseline />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;