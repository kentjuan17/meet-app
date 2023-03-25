import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { BsThreeDots, BsCameraVideoFill, BsFillTelephoneFill } from "react-icons/bs";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chat-info">
        <span>{data.user?.userName}</span>
        <div className="chat-icons">
          <span className="icons"><BsCameraVideoFill /></span>
          <span className="icons" style={{fontSize: 18, marginTop: 3}}><BsFillTelephoneFill /></span>
          <span className="icons"><BsThreeDots /></span>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
