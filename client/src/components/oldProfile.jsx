import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Typography, Modal, TextField } from "@mui/joy";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

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

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, {
        firstName: firstName,
        lastName: lastName
      });
      toast.success("Profile Updated Successfully", { position: "bottom-center" });
      setOpen(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", textAlign: "center", mt: 5 }}>
      {userDetails ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src={userDetails.photo}
              alt="User Profile"
              width={"40%"}
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <Typography level="h3">Welcome {userDetails.firstName} {userDetails.lastName}</Typography>
          <Typography level="body1" sx={{ mb: 2 }}>Email: {userDetails.email}</Typography>
          <Button variant="solid" onClick={handleLogout} sx={{ mb: 1 }}>
            Logout
          </Button>
          <Button variant="solid" onClick={() => setOpen(true)} sx={{ mb: 1 }}>
            Edit Profile
          </Button>
          <Button variant="solid" onClick={handleDeleteAccount}>
            Delete Account
          </Button>

          <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={{ maxWidth: 400, margin: "auto", p: 4, mt: 5, bgcolor: "background.paper", boxShadow: 24, borderRadius: 1 }}>
              <Typography level="h5" sx={{ mb: 2 }}>Edit Profile</Typography>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="solid" onClick={handleUpdateProfile}>
                Save Changes
              </Button>
            </Box>
          </Modal>
        </>
      ) : (
        <Typography level="body1">Loading...</Typography>
      )}
    </Box>
  );
}

export default Profile;
