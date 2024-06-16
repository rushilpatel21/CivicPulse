import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link className='navbar-options' to="/">Home</Link>
      <Link className='navbar-options' to="/voice-command">Voice Command</Link>
      <Link className='navbar-options' to="/add-contact">Add Contact</Link>
      <Link className='navbar-options' to="/signin">Sign in</Link>
      <Link className='navbar-options' to="/signup">Sign up</Link>
    </nav>
  );
};

export default Navbar;