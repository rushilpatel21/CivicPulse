import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link className='navbar-options' to="/">Home</Link>
      <Link className='navbar-options' to="/dashboard">Dashboard</Link>
      <Link className='navbar-options' to="/map">Heat Map</Link>
      <Link className='navbar-options' to="/issuedetails">IssueDetails</Link>
      <Link className='navbar-options' to="/issueform">IssueForm</Link>
      <Link className='navbar-options' to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;
