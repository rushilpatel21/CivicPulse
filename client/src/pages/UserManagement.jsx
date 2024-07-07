import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase.jsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUserInfo } from '../helper/api.js';
import Loader from '../components/loader.jsx';

// TODO: Add dropdown menu for roles 
const UserManagement = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
        fetchUsersData().then((data) => {
          setUsers(data);
        }).catch((error) => {
          console.error('Error fetching users:', error);
        });
      }
    });
  }, [navigate]);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log(response);

      if (!response) {
        throw new Error('Failed to fetch users data');
      }
      const data = await response; // why is there an await here? fix it idiota!!!!! :D 
      return data;
    } catch (error) {
      console.error('Error fetching users data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    withReactContent(Swal).fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        confirmedDeleteAccount(userId);
      } else {
        Swal.fire('Cancelled', 'Your account is safe :)', 'info');
      }
    })
  };

  const confirmedDeleteAccount = async (userId) => {
    try{
      setLoading(true);
      const response = await deleteUserInfo(userId);
      console.log(response);
      toast.success("Account Deleted Successfully", { position: "bottom-center" });
      const data = await fetchUsersData();
      setUsers(data);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDisable = (userId) => {
    const user = auth.currentUser;
    console.log(user);
    console.log(`Disabling user with ID: ${userId}`);
  };

  return (
    <>
      {loading && <Loader />}
      {loggedIn && (
        <div>
          <Typography variant="h4" gutterBottom>User Management</Typography>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Issues reported</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.reportsCount}</TableCell>
                    <TableCell>{user.role}</TableCell>
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