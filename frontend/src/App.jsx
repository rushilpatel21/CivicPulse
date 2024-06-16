import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home.js';
// import VoiceCommand from './pages/VoiceCommand';
// import AddContact from './pages/AddContact';
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp.js';
// import Transcribe from './pages/transcribe';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/voice-command" element={<VoiceCommand />} /> */}
          {/* <Route path="/add-contact" element={<AddContact />} /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/transcribe" element={<Transcribe />} />  */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;