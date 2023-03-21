import React, { useContext, useEffect, useRef } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";

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

  // variable to store how long the message was posted.
  let sentAt = 0;
  let mdate = "";

  if (minutes >= 1440) {
    // date and time should be posted
    sentAt = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    mdate = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } else if (minutes >= 180) {
    // after 3 hours, time should be posted. less than a day.
    sentAt = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (minutes >= 60) {
    // hours
    const hours = Math.floor(minutes / 60);
    sentAt = hours === 1 ? "an hour ago" : `${hours} hours ago`;
  } else if (minutes < 60) {
    // minutes
    sentAt = minutes < 5 ? "a while ago" : `${minutes} minutes ago`;
  }

  return (
    <div ref={ref} className={`message`}>
      <div className="message-date">{mdate}</div>
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
                : data.user.photoURL
            }
            alt=""
          />
        </div>
        <div className="message-content">
          <p>{message.text}</p>
          <span className="message-time-posted">{sentAt}</span>
          {message.img && <img src={message.img} alt="" />}
        </div>
      </div>
    </div>
  );
};

export default Message;
