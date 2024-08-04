import { useEffect, useState } from 'react';
import { auth } from '../components/firebase.jsx';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import IssueSections from '../components/IssueSections.jsx';

const IssueDetails = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Issue Detail",
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Log In',
        cancelButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else {
          navigate('/');
        }
      })
    };
    auth.onAuthStateChanged((user) => {
      if (!user) {
        usingSwal();
      } else {
        setLoggedIn(true);
      }
    });
  }, [navigate]);

  return (
    <>
      {loggedIn && (
        <div>
          <Box sx={{ paddingTop: '90px', width: '75vw' }}>
            <IssueSections />
          </Box>
        </div>
      )}
    </>
  );
};

export default IssueDetails;
