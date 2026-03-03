import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

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

  const handleGoogleLogin = async () => {
    try {
      // prompt: select_account lets user pick once;
      // after first login the browser session is cached so Google
      // signs back in instantly without showing the picker again.
      const provider = googleProvider;
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        alert(err.message);
      }
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
        <div className="auth-logo"><span className="auth-logo-icon">📝</span></div>
        <h1 className="auth-title">My Notes App</h1>
        <p className="auth-subtitle">Capture your thoughts, anywhere.</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
          Sign in with Google
        </button>
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
