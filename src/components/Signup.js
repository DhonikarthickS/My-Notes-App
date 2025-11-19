import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <button className="google-btn" onClick={handleGoogleSignup}>
          <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
