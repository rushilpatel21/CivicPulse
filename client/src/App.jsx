import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Profile from './pages/Profile.jsx';
import Map from './pages/Map.jsx';
import IssueForm from './pages/IssueForm.jsx';

import './styles/App.css';

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
