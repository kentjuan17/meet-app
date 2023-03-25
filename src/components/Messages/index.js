import React, { useState, useContext, useEffect } from "react";
import Message from "../Message";
import { ChatContext } from "../../context/ChatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { groupMessagesByDate } from "./functions";
import "./styles.scss";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsubscribe();
  }, [data.chatId]);

  const sortedMessages = groupMessagesByDate(messages);

  return (
    <div className="messages">
      {Object.entries(sortedMessages).map(([date, messages]) => (
        <div key={date} className="grouped-messages">
          <span className="messages-date">{date}</span>
          {messages.map((m) => (
            <Message message={m} key={m.id} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Messages;
