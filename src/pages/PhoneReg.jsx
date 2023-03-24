import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { updateProfile, signInWithPhoneNumber, RecaptchaVerifier, } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import "./../sass/style.scss";
import { useNavigate, Link } from "react-router-dom";
import { AiFillMail } from "react-icons/ai";

export const PhoneReg = () => {
    const [error, setError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();

    const sendVerificationCode = async (e, mobileNum) => {
        e.preventDefault();

        const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
        try {
            const result = await signInWithPhoneNumber(auth, mobileNum, recaptchaVerifier);
            setConfirmationResult(result);
        } catch (error) {
            console.error("Error sending verification code:", error);
            setError(true);
        }
    };

    const submitVerificationCode = async (e) => {
        e.preventDefault();

        try {
            await confirmationResult.confirm(verificationCode);

            // Move the handleRegister function's code here
            const userName = document.querySelector("input[type=text]").value;
            const mobileNum = document.querySelector("input[type=tel]").value;
            const userPicture = document.getElementById("avatar").files[0];

            setNameError(userName === "");

            if (userName === "") {
                return;
            }

            const user = auth.currentUser;
            if (user) {
                try {
                    const fileName = userName + "-" + Date.now();
                    const storageRef = ref(storage, fileName);

                    const uploadTask = uploadBytesResumable(storageRef, userPicture);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => {
                            setError(true);
                            console.log(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                                await updateProfile(user, {
                                    displayName: userName,
                                    photoURL: url,
                                });
                                await setDoc(doc(db, "users", user.uid), {
                                    uid: user.uid,
                                    userName,
                                    mobileNum,
                                    photoURL: url,
                                });
                                await setDoc(doc(db, "threads", user.uid), {});
                                navigate("/login");
                            });
                        }
                    );
                } catch (error) {
                    setError(true);
                }
            }
        } catch (error) {
            setError(true);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const mobileNum = e.target[1].value;

        const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
        try {
            const result = await signInWithPhoneNumber(auth, mobileNum, recaptchaVerifier);
            setConfirmationResult(result);
        } catch (error) {
            console.error("Error sending verification code:", error);
            setError(true);
        }
    };

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
                            <input
                                type="text" placeholder="Enter your full name"
                                onChange={(e) => {
                                    setNameError(false);
                                }}
                            /> {nameError && <span style={{ color: "#E74C3C", fontSize: 12, marginTop: -5 }}>Name is required</span>}
                            <div className="form-mobile">
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    disabled={!!confirmationResult}
                                />
                                {!confirmationResult ? (
                                    <input
                                        type="button"
                                        value="Verify Number"
                                        className="mobile-input"
                                        onClick={(e) => sendVerificationCode(e, e.target.previousSibling.value)}
                                    />
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter verification code"
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                        <input
                                            type="button"
                                            value="Submit Code"
                                            className="mobile-input"
                                            onClick={submitVerificationCode}
                                        />
                                    </>
                                )}
                            </div>
                            <input style={{ display: "none" }} type="file" id="avatar" />
                            <label htmlFor="avatar">
                                <img src={Add} alt="" />
                                <span>Upload display picture</span>
                            </label>
                            <button disabled={!confirmationResult}>Sign Up</button>
                            <div id="recaptcha-container"></div>
                            {error && <span>Something went wrong</span>}
                            <h4>or</h4>
                            <Link to="/register" style={{ textDecoration: 'none' }}><button className="btn-mobile"><AiFillMail />Sign up with Email</button></Link>
                        </form>
                        <p>
                            Already have an account? Login <Link to="/login">here</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
