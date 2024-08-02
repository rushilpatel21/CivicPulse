import { useEffect, useState } from 'react';
import { auth } from '../components/firebase.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowIssue from '../components/ShowIssue.jsx';

const departments = ['Road', 'Garden', 'Electricity', 'Drainage', 'Health & Hygiene', 'Smart Toilet', 'Water', 'Animals', 'Others'];

const IssueManagement = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'Please sign in to view Issue Management Tab',
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
      });
    };
    auth.onAuthStateChanged((user) => {
      if (!user) {
        usingSwal();
      } else {
        setLoggedIn(true);
      }
    });
  }, [navigate]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="xl">
      {loggedIn && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Issue Management
          </Typography>
          <Grid container spacing={2}>
            {departments.map((department, index) => (
              <Grid item xs={12} sm={12} md={12} key={index}>
                <Accordion
                  expanded={expanded === `panel${index + 1}`}
                  onChange={handleChange(`panel${index + 1}`)}
                  sx={{ width: '100%' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{department}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ShowIssue department={department} />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default IssueManagement;
