import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../sass/style.scss";

import { auth } from "./../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log(auth.currentUser);
      navigate("/");
    } catch (err) {
      setError(true);
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
              {error && <span>Something went wrong.</span>}
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
