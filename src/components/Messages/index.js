import React, { useState, useContext, useEffect } from "react";
import Message from "../Message";
import { ChatContext } from "../../context/ChatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "./styles.scss";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [dateOfMessage, setDateOfMessage] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsubscribe();
  }, [data.chatId]);

  //TODO: delete when done testing

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
