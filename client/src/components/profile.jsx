import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      toast.success("User logged out Successfully", {
        position: "bottom-center",
      });
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  async function handleDelteAccount() {
    try {
      const user = auth.currentUser;
      console.log(user.uid);
      await user.delete(); // Delete from the firebase auth.
      await deleteDoc(doc(db,"Users",user.uid)); // Delete from the database.
      console.log("User deleted successfully!");
      toast.success("Account Deleted Successfully", {
        position: "bottom-center",
      });
      navigate('/');
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  }
  return (
    <div>
      {userDetails ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={userDetails.photo}
              width={"40%"}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <h3>Welcome {userDetails.firstName + " " + userDetails.lastName}</h3>
          <div>
            <p>Email: {userDetails.email}</p>
          </div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn btn-primary" onClick={handleDelteAccount}>
            Delete Account
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default Profile;