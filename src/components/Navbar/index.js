import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import "./styles.scss";
import { BsPeopleFill, BsBoxArrowRight, BsFillGearFill, } from "react-icons/bs";

const Navbar = () => {
  const { currentUser, currentUserData, logout } =
    useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const [photoURL, setPhotoURL] = useState(currentUser.photoURL);
  const [userStatus, setUserStatus] = useState("");

  const fetchUserStatus = async () => {
    if (currentUser) {
      const statusDoc = await getDoc(doc(db, "status", currentUser.uid));
      if (statusDoc.exists()) {
        setUserStatus(statusDoc.data().about);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setPhotoURL(user.photoURL);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchUserStatus();
  }, [currentUser]);

  const handleSignOut = async () => {
    logout();
    dispatch({ type: "LOG_OUT" });
  };

  return (
    <div className="navbar">
      <div className="user">
        <div
          className={`user-status ${currentUserData?.isActive ? "online" : "offline"
            }`}
        ></div>
        <img src={photoURL} alt="" />
      </div>
      <div className="user-details">
        <span className="display-name">{currentUser.displayName}</span>
        <span className="user-status-text">{userStatus}</span>
      </div>
      <div className="actions">
        <button className="icon-chat">
          <BsPeopleFill />
        </button>
        <Link to="/edit-profile">
          <button className="icon-edit">
            <BsFillGearFill />
          </button>
        </Link>
        <button className="icon-chat tooltip" onClick={handleSignOut}>
          <BsBoxArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
