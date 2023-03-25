import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../sass/style.scss";
import { auth } from "./../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { BsFillTelephoneFill } from "react-icons/bs";

export const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user) {
        setError("Please verify your email before signing in.");
        return;
      }
      // console.log(userCredential.user);

      // set active status when user logs in
      const userRef = doc(db, "users", userCredential.user.uid);
      await updateDoc(userRef, { isActive: true });

      // navigate to home page
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.log(err);
    }
  };

  return (
    <>
      <div className="form-row">
        <div className="form-container img-bg">
          <h2>Welcome to Meet App!</h2>
          <hr />
          <p>Connecting you, anytime, anywhere!</p>
        </div>
        <div className="form-container register-form">
          <div className="form-wrapper">
            <h1 className="logo-responsive">Meet-up</h1>
            <span className="title">Sign In</span>
            <form>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Sign In</button>
              {error && (
                <span
                  style={{
                    color: "#E74C3C",
                    fontSize: 12,
                    marginTop: -5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {error}
                </span>
              )}
              <h4 style={{ marginTop: 5 }}>or</h4>
              <Link to="/mobileLogin" style={{ textDecoration: "none" }}>
                <button className="btn-mobile">
                  <BsFillTelephoneFill />
                  Sign in with Phone
                </button>
              </Link>
            </form>
            <p>
              Don't have an account yet? Register{" "}
              <Link to="/register">here</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
