import React, { useState, useEffect, useContext } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { ChatContext } from "../context/ChatContext";

const ChatThreads = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChatThreads = () => {
      const unsubscribe = onSnapshot(
        doc(db, "threads", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => unsubscribe();
    };

    //
    currentUser.uid && getChatThreads();
  }, [currentUser.uid]);

  // TODO: delete this when done testing
  console.log(Object?.entries(chats));

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    // Display user
    <div className="chats">
      {Object.entries(chats)?.map((chat) => (
        <div
          className="user-chat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="user-info">
            <span>{chat[1].userInfo.userName}</span>
            <p>{chat[1].userInfo.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatThreads;
