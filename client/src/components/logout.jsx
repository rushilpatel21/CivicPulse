import { useEffect } from "react";
import { auth } from "./firebase";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleLogout = async () => {
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
      };
    handleLogout();
  }, [navigate]);

  return (
    <></>
  );
}
export default Profile;