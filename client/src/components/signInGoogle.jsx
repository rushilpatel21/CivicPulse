import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import googleIconLight from "../assets/GoogleIconLight.png";
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../helper/email';

function SignInWithGoogle() {
  const navigate = useNavigate();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            email: user.email,
            firstName: user.displayName.split(" ")[0],
            lastName: user.displayName.split(" ").slice(1).join(" "),
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
      console.error("Error logging in with Google:", error.message);
      toast.error("Error logging in with Google", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="continue-google d-flex align-items-center justify-content-center">
      <div onClick={googleLogin} className="d-grid mb-3">
        <img className="continue-submit-icon" src={googleIconLight} alt="Google Icon" />
      </div>
    </div>
  );
}

export default SignInWithGoogle;
