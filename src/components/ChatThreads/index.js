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

      const qGroup = query(
        collection(db, "groups"),
        where("members", "array-contains", currentUser.uid)
      );

      const unsubGroup = onSnapshot(qGroup, (snap) => {
        const groups = [];
        snap.forEach((doc) => {
          const data = doc.data();
          const otherUsersId = data.members.filter(
            (id) => id !== currentUser.uid
          );

          if (doc.exists()) {
            groups.push({
              id: doc.id,
              type: "group",
              createdAt: data.createdAt,
              createdBy: data.createdBy,
              lastMessage: data.lastMessage,
              groupName: data.name,
              otherMembers: otherUsersId,
              otherUser: {},
            });
          }
          // console.log("Groups", ...groups);
          // TODO: pending fetch other members profile
          setThreads((prevThreads) => [
            ...prevThreads.filter((t) => t.type !== "group"),
            ...groups,
          ]);
        });
      });

      return () => {
        unsubPrivate();
        unsubGroup();
      };
    };
    currentUser.uid && getChatThreads();
  }, [currentUser]);

  // fetching user info from users collection to "threads" array.
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = threads.map((thread, i) => {
        if (thread.type === "private") {
          return thread.otherUser.id;
        } else {
          return thread.otherMembers;
        }
      });

      // console.log("user IDs", userIds);

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

      // Put user data to thread state
      setThreads((prevThreads) =>
        prevThreads.map((thread, i) => {
          if (thread.type === "private") {
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
          } else {
            return {
              ...thread,
              otherUser: {},
            };
          }
        })
      );
      // const prevThreads = threads;
      // const newT = prevThreads.map((thread, i) => {
      //   const otherUser = thread.otherUser;
      //   return {
      //     ...thread,
      //     otherUser: {
      //       ...otherUser,
      //       displayName: usersData[i].displayName,
      //       photoURL: usersData[i].photoURL,
      //       isActive: usersData[i].isActive,
      //       activeStatus: usersData[i].activeStatus,
      //     },
      //   };
      // });
      // setNewThreads(newT);
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
      {threads?.map((chat) => (
        <div
          className="user-chat"
          key={chat.id}
          onClick={() => handleSelect(chat)}
        >
          {chat.type === "private" && (
            <>
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
            </>
          )}
          {chat.type === "group" && (
            <>
              <div className="user-info">
                <span>{chat.groupName}</span>
                <p>{chat.lastMessage?.text}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatThreads;
