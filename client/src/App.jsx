import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Profile from './pages/Profile.jsx';
import Map from './pages/Map.jsx';
import IssueForm from './pages/IssueForm.jsx';

import './styles/App.css';

// TODO 1: We need to create a Login, Signup, logout and Profile page 
// TODO 2: We need to send the userName field too in the issueForm dataForm Object, otherwise we cant identify who raise the issue.
// TODO 3: Ask for location permission in heat map and focus the map on those lats and longs
// TODO 4: I would like to have two drop down bars at issue details, 1) would be my Issues, 2) would be Issues near me
// TODO 5: Dont forget to hash the passwords incase i dont use google Oauth

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
        <Route path="/issuedetails" element={<IssueDetails />} />
        <Route path="/issueform" element={<IssueForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
