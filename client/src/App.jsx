// TODO Fix the map first time loading error 
// TODO Make the home page 

import './styles/App.css';
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { CssBaseline } from '@mui/material';
import { isAdmin } from './helper/api.js';
import { auth } from './components/firebase.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Map from './pages/Map.jsx';
import IssueForm from './pages/IssueForm.jsx';
import Profile from "./components/profile.jsx";
import Login from "./components/login.jsx";
import SignUp from "./components/register.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import Logout from './components/logout.jsx';
import ReportBug from './pages/reportBug.jsx';
import UserManagement from './pages/UserManagement.jsx';
import IssueManagement from './pages/IssueManagement.jsx';

function App() {
  
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isAdmin(user.uid);
        setAdmin(adminStatus);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    console.log("Admin is: " + admin);
  }, [admin]);

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <ToastContainer 
              newestOnTop
            />
            <CssBaseline />
            <Navbar admin={admin}/>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/heatmap" element={<Map />} />
              <Route path="/issuedetails" element={<IssueDetails />} />
              <Route path="/issueform" element={<IssueForm />} />
              <Route path="/reportbug" element={<ReportBug />} />
              {!user && <Route path="/login" element={<Login />} />}
              {!user && <Route path="/register" element={<SignUp />} />}
              {!user && <Route path="/resetpassword" element={<ResetPassword />} />}
              {user && <Route path="/logout" element={<Logout />} />}
              {user && <Route path="/profile" element={<Profile />} />}
              {user && admin && <Route path="/usermanagement" element={<UserManagement />} />}
              {user && admin && <Route path="/issuemanagement" element={<IssueManagement />} />}
              {/* {user && admin && <Route path="/dashboard" element={<Dashboard />} />} */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;