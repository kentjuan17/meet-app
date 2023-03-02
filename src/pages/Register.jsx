import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export const Register = () => {
 
  const [error, setError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const userName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const userPicture = e.target[3].files[0];

    try {
      const res = createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(true)
    }
    
  }

  return (
    <>
      <div className="form-row">
        <div className="form-container img-bg">
          <h1>Welcome to Meet App</h1>
          <hr />
          <p>Connecting you, anytime, anywhere!</p>
        </div>
        <div className="form-container register-form">
          <div className="form-wrapper">
            <h1 className="logo-responsive">Meet-up</h1>
            <span className="title">Sign Up</span>
            <form onSubmit={handleRegister}>
              <input type="text" placeholder="Enter your full name" />
              <input type="email" placeholder="Enter your email" />
              <input type="password" placeholder="Enter your password" />
              <input style={{ display: "none" }} type="file" id="avatar" />
              <label htmlFor="avatar">
                <img src={Add} alt="" />
                <span>Upload display picture</span>
              </label>
              <button>Sign Up</button>
            </form>
            <p>Already have an account? Login here.</p>
          </div>
        </div>
      </div>
    </>
  );
};
