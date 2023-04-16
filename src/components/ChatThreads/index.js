import React, { useState, useEffect, useContext } from "react";
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { ChatContext } from "../../context/ChatContext";
import "./styles.scss";

const ChatThreads = () => {
  const [threads, setThreads] = useState([]);
  const [newThreads, setNewThreads] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const { dispatch } = useContext(ChatContext);

  // retrieves all conversations made by the user
  useEffect(() => {
    const getChatThreads = () => {
      const q = query(
        collection(db, "private-chats"),
        where("members", "array-contains", currentUser.uid)
      );

      const unsubPrivate = onSnapshot(q, (snap) => {
        const threadsData = snap.docs.map((doc) => {
          const data = doc.data();
          const otherUserId = data.members.filter(
            (id) => id !== currentUser.uid
          )[0];

          return {
            id: doc.id,
            type: "private",
            otherUser: {
              id: otherUserId,
              displayName: "",
              photoURL: "",
              isActive: false,
              activeStatus: "",
            },
            lastMessage: data.lastMessage,
          };
        });
        setThreads((prevThreads) => [
          ...prevThreads.filter((t) => t.type !== "private"),
          ...threadsData,
        ]);
      });

      return () => unsubPrivate();
    };
    currentUser.uid && getChatThreads();
  }, [currentUser]);

  // fetching user info from users collection to "threads" array.
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = threads.map((thread) => {
        if (thread.type === "private") {
          return thread.otherUser.id;
        } else {
          return thread.lastMessage.senderId;
        }
      });

      const q = query(collection(db, "users"), where("uid", "in", userIds));
      const usersSnapshot = await getDocs(q);
      let usersData = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          displayName: data.displayName,
          photoURL: data.photoURL,
          isActive: data.isActive,
          activeStatus: data.activeStatus,
        });
      });
      const prevThreads = threads;
      const newT = prevThreads.map((thread, i) => {
        const otherUser = thread.otherUser;
        return {
          ...thread,
          otherUser: {
            ...otherUser,
            displayName: usersData[i].displayName,
            photoURL: usersData[i].photoURL,
            isActive: usersData[i].isActive,
            activeStatus: usersData[i].activeStatus,
          },
        };
      });
      setNewThreads(newT);
    };

    if (threads.length > 0) {
      fetchUsers();
    }
  }, [threads]);

  const handleSelect = (chatData) => {
    dispatch({ type: "CHANGE_USER", payload: chatData });
  };

  // console.log("Threads: => ", threads);
  // console.log("New Threads: => ", newThreads);

  return (
    // Display user
    <div className="chats">
      {newThreads?.map((chat) => (
        <div
          className="user-chat"
          key={chat.id}
          onClick={() => handleSelect(chat)}
        >
          <div className="user">
            <div
              className={`user-status ${chat.otherUser?.activeStatus}`}
            ></div>
            <img src={chat.otherUser?.photoURL} alt="" />
          </div>
          <div className="user-info">
            <span>{chat.otherUser?.displayName}</span>
            <p>{chat.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatThreads;
