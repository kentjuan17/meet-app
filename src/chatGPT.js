import { useEffect, useState } from "react";
import { firestore } from "./firebase";

function ChatThreads({ currentUser }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const unsubscribePrivate = firestore
      .collection("private_conversations")
      .where("members", "array-contains", currentUser.uid)
      .orderBy("latestMessage.sentAt", "desc")
      .onSnapshot((snapshot) => {
        const threadsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const otherUserId = data.members.filter((id) => id !== currentUser.uid)[0];
          return {
            id: doc.id,
            type: "private",
            otherUser: {
              id: otherUserId,
              displayName: "",
              photoURL: "",
            },
            latestMessage: data.latestMessage,
          };
        });
        setThreads((prevThreads) => [...prevThreads.filter((t) => t.type !== "private"), ...threadsData]);
      });

    const unsubscribeGroup = firestore
      .collection("groups")
      .where("members", "array-contains", currentUser.uid)
      .orderBy("latestMessage.sentAt", "desc")
      .onSnapshot((snapshot) => {
        const threadsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "group",
            groupName: data.name,
            latestMessage: data.latestMessage,
          };
        });
        setThreads((prevThreads) => [...prevThreads.filter((t) => t.type !== "group"), ...threadsData]);
      });

    return () => {
      unsubscribePrivate();
      unsubscribeGroup();
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = threads.map((thread) => {
        if (thread.type === "private") {
          return thread.otherUser.id;
        } else {
          return thread.latestMessage.senderId;
        }
      });
      const usersRef = firestore.collection("users");
      const usersSnapshot = await usersRef.where("uid", "in", userIds).get();
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.uid] = { displayName: data.displayName, photoURL: data.photoURL };
        return acc;
      }, {});
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.type === "private") {
            const otherUser = thread.otherUser;
            return {
              ...thread,
              otherUser: {
                ...otherUser,
                displayName: usersData[otherUser.id].displayName,
                photoURL: usersData[otherUser.id].photoURL,
              },
            };
          } else {
            return {
              ...thread,
              latestMessage: {
                ...thread.latestMessage,
                senderDisplayName: usersData[thread.latestMessage.senderId].displayName,
                senderPhotoURL: usersData[thread.latestMessage.senderId].photoURL,
              },
            };
          }
        })
      );
    };
    if (threads.length > 0) {
      fetchUsers();
    }
  }, [threads]);

  return (
    <div>
      <h2>Chat Threads</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            {thread.type === "private" && (
              <div>
                <img src={thread.otherUser.photoURL} alt={thread.otherUser.displayName} />
                <div>{thread.otherUser.displayName}</div>
              </div>
            )}
            {thread
