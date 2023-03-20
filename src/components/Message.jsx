import React, { useContext, useEffect, useRef } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Get the current timestamp
  const currentTimestamp = new Date().getTime();

  // Firebase Firestore Timestamp in milliseconds
  const timestamp = message.date.toMillis();

  // convert timestamp to date object
  const date = new Date(timestamp);

  const timeDifference = currentTimestamp - timestamp;

  const minutes = Math.floor(timeDifference / 1000 / 60);
  // console.log(hours);
  console.log(minutes);

  let time = 0;

  if (minutes >= 1440) {
    // date and time should be posted
    time = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  if (minutes >= 180) {
    // after 3 hours, time should be posted. less than a day.
    time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  if (minutes >= 60) {
    // hours
    const hours = Math.floor(minutes / 60);
    time = hours === 1 ? "an hour ago" : `${hours} hours ago`;
    console.log("test", hours);
  }
  if (minutes < 60) {
    // minutes
    time = minutes < 5 ? "a while ago" : `${minutes} minutes ago`;
  }

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
        <span className="message-sent">{time}</span>
      </div>
      <div className="message-content">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
