import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import githubIcon from "../assets/GithubIconLight.png"; 
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../helper/email';

function SignInWithGithub() {
  const navigate = useNavigate();
  
  const githubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            firstName: user.displayName,
            lastName: "",
            photo: user.photoURL,
            role: "User",
            isEnabled: true
          });
          sendEmail(user.email, user.displayName);
        }
        toast.success("User logged in Successfully", {
          position: "bottom-center",
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Error during Github login:", error);
      toast.error("Failed to login with Github", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="continue-google d-flex align-items-center justify-content-center">
      <div onClick={githubLogin} className="d-grid mb-3">
        <img className="continue-submit-icon" src={githubIcon} alt="Github Icon" />
      </div>
    </div>
  );
}

export default SignInWithGithub;
