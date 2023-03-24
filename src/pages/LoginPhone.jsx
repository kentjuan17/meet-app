import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../sass/style.scss";
import { auth } from "./../firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { AiFillMail } from "react-icons/ai";

export const LoginPhone = () => {
  const [error, setError] = useState(false);
  const [mobileNum, setMobileNum] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const submitVerificationCode = async (e) => {
    e.preventDefault();

    try {
      await confirmationResult.confirm(mobileNum);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
    try {
      const result = await signInWithPhoneNumber(auth, mobileNum, recaptchaVerifier);
      setConfirmationResult(result);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError(error.message);
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
              <div className="form-mobileLogin">
                <input type="tel" placeholder="Enter your phone number" onChange={(e) => setMobileNum(e.target.value)} />
                <button onClick={handleLogin} className="mobile-input">Verify Number</button>
                {!!confirmationResult && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      onChange={(e) => setMobileNum(e.target.value)}
                    />
                    <button onClick={submitVerificationCode} className="mobile-input">Submit Code</button>
                  </>
                )}
              </div>
              <div id="recaptcha-container"></div>
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
              <h4 style={{ marginTop: -20 }}>or</h4>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button className="btn-mobile">
                  <AiFillMail />
                  Sign in with Email
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
