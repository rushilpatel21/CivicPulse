import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase.jsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const UserManagement = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Dashboard",
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
        // Fetch users data from API (replace with your API call)
        fetchUsersData().then((data) => {
          setUsers(data);
        }).catch((error) => {
          console.error('Error fetching users:', error);
          // Handle error
        });
      }
    });
  }, [navigate]);

  // Example function to fetch users data (replace with your actual API call)
  const fetchUsersData = async () => {
    try {
      // Replace with actual API call to fetch users data
      const response = await fetch('https://api.example.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users data:', error);
      throw error;
    }
  };

  const handleDelete = (userId) => {
    // Implement delete functionality here (e.g., API call to delete user)
    console.log(`Deleting user with ID: ${userId}`);
  };

  const handleDisable = (userId) => {
    // Implement disable functionality here (e.g., API call to disable user)
    console.log(`Disabling user with ID: ${userId}`);
  };

  return (
    <>
      {loggedIn && (
        <div>
          <Typography variant="h4" gutterBottom>User Management</Typography>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Sign up date</TableCell>
                  <TableCell>Last Logged in date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Number of issues reported</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.signupDate}</TableCell>
                    <TableCell>{user.lastLoggedIn}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.numIssuesReported}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleDisable(user.id)}>
                        Disable
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default UserManagement;


/*
  A table with Name, email, Sign up date, Last Logged in date, Role(dropdown for Admin or User),Number of issues reported ,Delete (button), Disable(buttom) 

  Example: {
    "Name": "John Doe", // done
    "Email": "johndoe@gmail.com", // done
    "Sign up date": "12/12/2021",
    "Last Logged in date": "20/12/2021",
    "Role": "Admin", // done
    "Number of issues reported": 5,(reportsCount) // done
  }

*/