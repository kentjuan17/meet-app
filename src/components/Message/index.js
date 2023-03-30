import React, { useContext, useEffect, useRef } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";
import { getSentAt } from "./functions";

const Message = ({ message }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // gets Firebase Firestore Timestamp in milliseconds and returns message sent time
  const sentAt = getSentAt(message.sentAt?.toMillis());

  return (
    <div ref={ref} className={`message`}>
      <div
        className={`message-bar ${
          message.senderId === currentUser.uid && "current-user"
        }`}
      >
        <div className="message-info">
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.photoURL
            }
            alt=""
          />
        </div>
        <div className="message-content">
          <p>{message.text}</p>
          {message.img && <img src={message.img} alt="" />}
          <span className="message-time-posted">{sentAt}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
