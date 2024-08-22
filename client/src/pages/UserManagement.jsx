// TODO: The page is not responsive.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase.jsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUserInfo, changeRoleById, disableUserInfo, enableUserInfo } from '../helper/api.js';
import Loader from '../components/loader.jsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
      const data = await response;
      return data;
    } catch (error) {
      console.error('Error fetching users data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const myId =  auth.currentUser;
    if(myId.uid === userId){
      toast.error("You cannot delete your own account", { position: "bottom-center" });
      return;
    }
    if(userId === import.meta.env.VITE_GOOGLE_RUSHIL_ID){
      toast.error("You cannot delete this account (Owner)", { position: "bottom-center" });
      return;
    }
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
        Swal.fire('Cancelled', 'Account is safe :)', 'info');
      }
    })
  };

  const confirmedDeleteAccount = async (userId) => {
    try {
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
  };

  const handleDisable = (userId) => {
    const myId =  auth.currentUser;
    if(myId.uid === userId){
      toast.error("You cannot disable your own account", { position: "bottom-center" });
      return;
    }
    if(userId === import.meta.env.VITE_GOOGLE_RUSHIL_ID){
      toast.error("You cannot disable this account (Owner)", { position: "bottom-center" });
      return;
    }
    withReactContent(Swal).fire({
      title: 'Are you sure?',
      text: 'User will not be able to access this account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        confirmedDisableAccount(userId);
      } else {
        Swal.fire('Cancelled', 'Account wont be disabled :)', 'info');
      }
    })

  };

  const handleEnable = (userId) => {
    const myId =  auth.currentUser;
    if(myId.uid === userId){
      toast.error("You cannot enable your own account", { position: "bottom-center" });
      return;
    }
    withReactContent(Swal).fire({
      title: 'Are you sure?',
      text: 'User will be able to access this account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, enable it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        confirmedEnableAccount(userId);
      } else {
        Swal.fire('Cancelled', 'Account wont be enabled :)', 'info');
      }
    })
  }

  const confirmedDisableAccount = async (userId) => {
    try {
      setLoading(true);
      const response = await disableUserInfo(userId);
      console.log(response);
      toast.success("Account Disabled Successfully", { position: "bottom-center" });
      const data = await fetchUsersData();
      setUsers(data);
    } catch (error) {
      console.error('Error disabling user:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmedEnableAccount = async (userId) => {
    try {
      setLoading(true);
      const response = await enableUserInfo(userId);
      console.log(response);
      toast.success("Account Enabled Successfully", { position: "bottom-center" });
      const data = await fetchUsersData();
      setUsers(data);
    } catch (error) {
      console.error('Error enabling user:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChangeSubmit = async (userId, newRole) => {
    try {
      const myId =  auth.currentUser;
      if(myId.uid === userId){
        toast.error("You cannot change your own role", { position: "bottom-center" });
        return;
      }
      if(userId === import.meta.env.VITE_GOOGLE_RUSHIL_ID){
        toast.error("You cannot change this account's Role (Owner)", { position: "bottom-center" });
        return;
      }

      setLoading(true);
      const response = await changeRoleById(userId, newRole);
      console.log(response);
      toast.success("Role Updated Successfully", { position: "bottom-center" });
      const data = await fetchUsersData();
      setUsers(data);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      {loading && <Loader />}
      {loggedIn && (
        <div>
          <Typography style={{marginTop: '90px'}} variant="h4" gutterBottom>User Management</Typography>
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
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChangeSubmit(user.id, e.target.value)}
                        sx={{ width: 100, height: 40 }}
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>{user.reportsCount}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)} sx={{ width: 90, height: 40 }}>
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      {user.isEnabled &&  <Button variant="contained" color="primary" onClick={() => handleDisable(user.id)} sx={{ width: 90, height: 40 }}>
                        Disable
                      </Button>}
                      {!user.isEnabled &&  <Button variant="contained" color="primary" onClick={() => handleEnable(user.id)} sx={{ width: 90, height: 40 }}>
                        Enable
                      </Button>}
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