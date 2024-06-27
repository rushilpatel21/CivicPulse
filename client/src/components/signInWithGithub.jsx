import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import githubIcon from "../assets/GithubIconLight.png"; 
import { useNavigate } from 'react-router-dom';

function SignInWithGithub() {
  const navigate = useNavigate();
  
  function githubLogin() {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (result.user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "bottom-center",
        });
        navigate('/');
      }
    });
  }
  
  return (
    <div className="continue-github">
      <div  onClick={githubLogin}>
        <img className="continue-github-icon" src={githubIcon} alt="GitHub Icon" />
      </div>
    </div>
  );
}

export default SignInWithGithub;