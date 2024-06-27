import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: ""
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "bottom-center",
      });
      navigate('/login');
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center">
      <div>
        <form onSubmit={handleRegister} className="p-4 bg-light rounded shadow">
          <h3 className="text-center mb-4">Sign Up</h3>

          <div className="mb-3">
            <label htmlFor="inputFirstName" className="form-label">First name</label>
            <input
              type="text"
              className="form-control"
              id="inputFirstName"
              placeholder="First name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="inputLastName" className="form-label">Last name</label>
            <input
              type="text"
              className="form-control"
              id="inputLastName"
              placeholder="Last name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

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
            <button type="submit" className="btn btn-primary continue-submit-icon">Sign Up</button>
          </div>

          <p className="text-center">Already registered? <a href="/login">Login Here</a></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
