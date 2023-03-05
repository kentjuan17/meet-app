import React, { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { data } = useContext(ChatContext);
  const [time, setTime] = useState("");
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Get the current timestamp
  const currentTimestamp = new Date().getTime();

  // Assume `timestamp` is a Firebase Firestore Timestamp
  // const timestamp = message.date.Timestamp.fromDate(new Date());

  setInterval(function () {
    // Get the time difference in milliseconds
    const timeDifference = currentTimestamp - message.date.toDate().getTime();
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    // console.log(minutes);
    setTime(minutes);
  }, 60000);

  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid && "current-user"
      }`}
    >
      <div className="message-info">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{`${time > 5 ? `${time} minutes ago` : "a while ago"}`}</span>
      </div>
      <div className="message-content">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
