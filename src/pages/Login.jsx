import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../sass/style.scss";
import { auth } from "./../firebase";
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

export const Login = () => {
  const [error, setError] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (identifier.includes("@")) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        if (!userCredential.user) {
          setError("Please verify your email before signing in.");
          return;
        }
        console.log(userCredential.user);
        navigate("/");
      } catch (err) {
        setError("Invalid email or password. Please try again.");
        console.log(err);
      }
    } else {
      try {
        const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
        const confirmationResult = await signInWithPhoneNumber(auth, identifier, recaptchaVerifier);
        const verificationCode = prompt("Enter the verification code sent to your phone number:");
        const userCredential = await confirmationResult.confirm(verificationCode);
        console.log(userCredential.user);
        navigate("/");
      } catch (err) {
        setError("Invalid phone number or verification code. Please try again.");
        console.log(err);
      }
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
                type="text"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Sign In</button>
              <div id="recaptcha-container"></div>
              {error && <span style={{color: "#E74C3C", fontSize: 12, marginTop: -5, display: "flex", alignItems: "center", justifyContent: "center"}}>{error}</span>}
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
