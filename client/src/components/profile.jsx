import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { deleteIssueById } from '../helper/api.js';

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
        } else {
          console.log("User is not logged in");
        }
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("User logged out Successfully", { position: "bottom-center" });
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
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
        try {
          const user = auth.currentUser;
          console.log(user.uid);
          const issues = deleteIssueById(user.uid);
          console.log("Issues deleted:", issues);
        } catch (error){
          console.error("Error deleting user issues:", error.message);
        }
        confirmedDeleteAccount();
      } else {
        Swal.fire('Cancelled', 'Your account is safe :)', 'info');
      }
    })
  };

  const confirmedDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      await user.delete(); // Delete from the firebase auth.
      await deleteDoc(doc(db, "Users", user.uid)); // Delete from the database.
      toast.success("Account Deleted Successfully", { position: "bottom-center" });
      navigate('/');
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, {
        firstName: firstName,
        lastName: lastName,
      });
      toast.success("Profile Updated Successfully", { position: "bottom-center" });
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <Box
        component="form"
        onSubmit={handleUpdateProfile}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 3,
          width: { sm: 350, md: 450 },
          position: 'relative'
        }}
        noValidate
        autoComplete="off"
      >
        {userDetails ? (
          <>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <MenuItem onClick={handleDeleteAccount}>Delete Account</MenuItem>
            </Menu>
            <div className="text-center mb-4">
              <img
                src={userDetails.photo}
                alt="User Profile"
                width={"40%"}
                style={{ borderRadius: "50%" }}
                className="mb-2"
              />
              <Typography variant="h5">Hi, {firstName}</Typography>
            </div>

            <TextField
              required
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              required
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              required
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              InputProps={{
                readOnly: true,
              }}
            />

            <div className="d-flex justify-content-between mt-3">
              <Button variant="contained" color="primary" type="submit">Save</Button>
              <Button variant="outlined" color="secondary" onClick={fetchUserData}>Cancel</Button>
            </div>
          </>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </Box>
    </div>
  );
}

export default Profile;
