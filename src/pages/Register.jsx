import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import "./../sass/style.scss";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const userPicture = e.target[3].files[0];

    if (password.length < 6) {
      console.log("Passwords should have a minimum of 6 digits");

      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const fileName = userName + "-" + Date.now();
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, userPicture);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          setError(true);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: url,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              userName,
              email,
              photoURL: url,
            });
            await setDoc(doc(db, "threads", res.user.uid), {});
            navigate("/login");
          });
        }
      );
    } catch (error) {
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
              <input required type="text" placeholder="Enter your full name" />
              <input required type="email" placeholder="Enter your email" />
              <input
                required
                type="password"
                placeholder="Enter your password"
              />
              <input style={{ display: "none" }} type="file" id="avatar" />
              <label htmlFor="avatar">
                <img src={Add} alt="" />
                <span>Upload display picture</span>
              </label>
              <button>Sign Up</button>
              {error && <span>Something went wrong</span>}
            </form>
            <p>
              Already have an account? Login <Link to="/login">here</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
