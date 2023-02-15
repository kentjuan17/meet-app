import React from "react";
import Add from "../img/addAvatar.png";

export const Register = () => {
  return (
    <>
      <div className="form-row">
        <div className="form-container img-bg">
          <h1>Meet App</h1>
          <hr />
          <p>Connecting you, anytime, anywhere!</p>
        </div>
        <div className="form-container register-form">
          <div className="form-wrapper">
            <span className="title">Sign Up</span>
            <form>
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
