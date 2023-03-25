import React, { useContext } from "react";
import More from "./../../img/more.png";
import Messages from "../Messages";
import Input from "../Input";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";

const Chat = () => {
  // const [show, setShow] = useState(false);
  const { data } = useContext(ChatContext);

  // if (data.user.uid) {
  //   setShow(true);
  // }

  return (
    <div className="chat">
      <div className="chat-info">
        <div className="user">
          <div className={`user-status`}></div>
          <img src={data.user?.photoURL} alt="" />
        </div>
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
