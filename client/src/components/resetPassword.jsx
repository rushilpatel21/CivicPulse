import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function Register() {
  const [email, setEmail] = useState("");
  const auth = getAuth();

  const handleReset = async (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
    .then(() => {
        toast.success("Reset Link Sent Successfully!!", {
            position: "bottom-center",
        });
    })
    .catch((error) => {
        console.log(error.message);
        toast.error(error.message, {
            position: "bottom-center",
        });
    });

  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center">
      <Box
        component="form"
        onSubmit={handleReset}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
          width: { sm: 350, md: 450 },
        }}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-center mb-4">Reset Password</h3>

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

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-primary">Send Link</button>
        </div>

        <p className="login-paragraph">Already registered? <a href="/login">Login Here</a></p>
        <p className="login-paragraph">New user? <a href="/register">Register Here</a></p>
      </Box>
    </div>
  );
}

export default Register;
