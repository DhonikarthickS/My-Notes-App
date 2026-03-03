import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // If already logged in, redirect to dashboard
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

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
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🚀</span>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join and start taking notes today.</p>

        <button className="google-btn" onClick={handleGoogleSignup}>
          <img
            src="https://img.icons8.com/color/24/google-logo.png"
            alt="Google"
          />
          Sign up with Google
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
