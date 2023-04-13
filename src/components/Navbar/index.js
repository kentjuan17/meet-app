import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import "./styles.scss";
import { BsPeopleFill, BsBoxArrowRight, BsFillGearFill } from "react-icons/bs";

const Navbar = () => {
  const { currentUser, currentUserData, logout } =
    useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const [photoURL, setPhotoURL] = useState(currentUser.photoURL);

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
      <span style={{marginLeft: 10, width: '100%'}}>{currentUser.displayName}</span>
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
