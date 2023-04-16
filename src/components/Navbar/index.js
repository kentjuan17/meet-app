import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import "./styles.scss";
import { BsPeopleFill, BsBoxArrowRight, BsFillGearFill } from "react-icons/bs";

const Navbar = () => {
  const { currentUser, logout } = useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const [photoURL, setPhotoURL] = useState(currentUser.photoURL);
  const [userStatus, setUserStatus] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState("online");

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
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
    (async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserStatus(userDoc.data().status);
          setActiveStatus(userDoc.data().activeStatus);
        }
      }
    })();
  }, [currentUser]);

  const handleSignOut = async () => {
    toggleLogoutModal();
    logout();
    dispatch({ type: "LOG_OUT" });
  };

  const LogoutModal = () => (
    <div className="logout-modal">
      <div className="modal-content">
        <h4>Are you sure you want to logout?</h4>
        <div className="buttons">
          <button
            style={{
              backgroundColor: "#9d4edd",
              border: "none",
              color: "white",
              marginBottom: 5,
            }}
            onClick={handleSignOut}
          >
            Yes
          </button>
          <button
            style={{
              backgroundColor: "#f15c4f",
              border: "none",
              color: "white",
            }}
            onClick={toggleLogoutModal}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="navbar">
      {showLogoutModal && <LogoutModal />}
      <div className="user">
        <div className={`user-status ${activeStatus}`}></div>
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
        <button className="icon-chat tooltip" onClick={toggleLogoutModal}>
          <BsBoxArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
