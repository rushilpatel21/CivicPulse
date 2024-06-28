import '../styles/Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import SignInWithGithub from "./signInWithGithub.jsx";
import SignInWithGoogle from "./signInGoogle.jsx";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
    <div className="container-fluid padding-login d-flex align-items-center justify-content-center">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
          width: { sm: 300, md: 450 },
        }}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-center mb-4">Login</h3>

        <TextField
          required
          id="outlined-email"
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          id="outlined-password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-primary continue-submit-ico">Submit</button>
        </div>

        <p className="login-paragraph">New user? <a href="/register">Register Here</a></p>
        <p className="login-paragraph">Forgot Password? <a href="/resetpassword">Reset Here</a></p>
        <p className="login-paragraph-icon">--Or continue with--</p>
        <SignInWithGoogle />
        <SignInWithGithub />
      </Box>
    </div>
  );
}

export default Login;
