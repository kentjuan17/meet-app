import React, { useContext, useState, useEffect } from "react";
import Input from "../Input";
import Messages from "./../Messages";
import { ChatContext } from "../../context/ChatContext";
import { auth, db, storage } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import {
  BsThreeDots,
  BsCameraVideoFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import "./styles.scss";

const UserModal = ({ data, userStatus, toggleUserModal }) => (
  <div className="user-modal">
    <div className="modal-content">
      <img src={data?.photoURL} alt="" />
      <h4>{data?.displayName}</h4>
      <p>{userStatus && userStatus !== "" ? userStatus : "No status provided"}</p>
      <button onClick={toggleUserModal}>Close</button>
    </div>
  </div>
);

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userStatus, setUserStatus] = useState("");

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  const fetchUserStatus = async (chatId) => {
    if (chatId) {
      const uids = chatId.split('_'); // Extract the uids from the chatId
      const otherUid = uids[0] === auth.currentUser.uid ? uids[1] : uids[0]; // Get the other user's uid
  
      const userDoc = await getDoc(doc(db, "users", otherUid));
      if (userDoc.exists()) {
        console.log("Fetched status:", userDoc.data().status);
        setUserStatus(userDoc.data().status || "");
      } else {
        setUserStatus("");
      }
    }
  };

  useEffect(() => {
    fetchUserStatus(data.chatId);
  }, [data.chatId]);

  return (
    <div className="chat">
      {showUserModal && (
        <UserModal data={data} userStatus={userStatus} toggleUserModal={toggleUserModal} />
      )}
      <div className="chat-info">
        <div className="userInfo">
          <img
            src={data?.photoURL}
            alt=""
            onClick={toggleUserModal}
            className="chat-avatar"
          />
          <div className="chat-name-status">
            <span className="display-name">{data?.displayName}</span>
            {data?.chatId !== "null" && (
              <span className="status">
                {data?.isActive ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>
        <div className="chat-icons">
          <span className="icons">
            <BsCameraVideoFill />
          </span>
          <span className="icons" style={{ fontSize: 18, marginTop: 3 }}>
            <BsFillTelephoneFill />
          </span>
          <span className="icons">
            <BsThreeDots />
          </span>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
