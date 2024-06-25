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

// TODO 1: We need to create a Login, Signup, logout and Profile page 
// TODO 2: We need to send the userName field too in the issueForm dataForm Object, otherwise we cant identify who raise the issue.
// TODO 3: Ask for location permission in heat map and focus the map on those lats and longs
// TODO 4: I would like to have two drop down bars at issue details, 1) would be my Issues, 2) would be Issues near me
// TODO 5: Dont forget to hash the passwords incase i dont use google Oauth


function App() {
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;