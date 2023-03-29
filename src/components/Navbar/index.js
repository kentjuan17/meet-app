import React, { useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";
import { BsFillChatLeftTextFill, BsBoxArrowRight } from "react-icons/bs";

const Navbar = () => {
  const { currentUser, currentUserData, logout } =
    useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  const handleSignOut = async () => {
    logout();
    dispatch({ type: "LOG_OUT" });
  };

  return (
    <div className="navbar">
      <div className="user">
        <div
          className={`user-status ${
            currentUserData?.isActive ? "online" : "offline"
          }`}
        ></div>
        <img src={currentUser.photoURL} alt="" />
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
