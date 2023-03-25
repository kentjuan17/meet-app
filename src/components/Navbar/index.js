import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";
import { BsFillChatLeftTextFill, BsBoxArrowRight, BsDot } from "react-icons/bs";

const Navbar = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const handleSignOut = async () => {
    try {
      // Update the user's isActive status to false
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { isActive: false });

      // sign out user and reset all state
      signOut(auth);
      dispatch({ type: "LOG_OUT" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar">
      <div className="user">
        <div className="user-status"></div>
        <img src={currentUser.photoURL} alt="" />
        {currentUser && <span className="online-indicator"><BsDot /></span>}
      </div>  
      <div className="actions">
        <button className="icon-chat">
          <BsFillChatLeftTextFill />
        </button>
        <button className="icon-chat" onClick={handleSignOut}>
          <BsBoxArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
