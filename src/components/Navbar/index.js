import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";
import { BsFillChatLeftTextFill, BsBoxArrowRight, BsDot } from "react-icons/bs";

const Navbar = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const handleSignOut = () => {
    signOut(auth);
    dispatch({ type: "LOG_OUT" });
  };

  return (
    <div className="navbar">
      <div className="user">
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
