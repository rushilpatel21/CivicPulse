import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { useEffect, useState } from 'react';
import { auth } from './firebase';

const Navbar = () => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <nav className="navbar">
      <Link className='navbar-options' to="/">Home</Link>
      <Link className='navbar-options' to="/dashboard">Dashboard</Link>
      <Link className='navbar-options' to="/map">Heat Map</Link>
      <Link className='navbar-options' to="/issuedetails">IssueDetails</Link>
      <Link className='navbar-options' to="/issueform">IssueForm</Link>
      {user && <Link className='navbar-options' to="/profile">Profile</Link>}
      {!user && <Link className='navbar-options' to="/login">Log In</Link>}
    </nav>
  );
};

export default Navbar;
