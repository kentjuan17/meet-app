import React, { useContext } from "react";
import More from "./../../img/more.png";
import Messages from "../Messages";
import Input from "../Input";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chat-info">
        <span>{data.user?.userName}</span>
        <div className="chat-icons">
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
