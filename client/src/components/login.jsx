import '../styles/Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import SignInWithGithub from "./signInWithGithub.jsx";
import SignInWithGoogle from "./signInWithGoogle.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      toast.success("User logged in Successfully", {
        position: "bottom-center",
      });
      navigate('/');
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="container-fluid pt-5 d-flex align-items-center justify-content-center">
      <div>
        <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
          <h3 className="text-center mb-4">Login</h3>

          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary continue-submit-icon">Submit</button>
          </div>

          <p className="text-center">New user? <a href="/register">Register Here</a></p>
          <p className="text-center">--Or continue with--</p>
          <SignInWithGoogle />
          <SignInWithGithub />
        </form>
      </div>
    </div>
  );
}

export default Login;
