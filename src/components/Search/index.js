import React, { useState, useContext } from "react";
import { db } from "../../firebase";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import "./styles.scss";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);

  // search user
  const handleSearchUser = async () => {
    const q = query(collection(db, "users"), where("userName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  // proceed to search the user when "enter" key was pressed
  const handleEnterKey = (e) => e.code === "Enter" && handleSearchUser();

  // Adding a contact by clicking the searched user
  const handleStartChat = async () => {
    // creating an id for the private conversation
    const threadId =
      currentUser.uid > user.uid
        ? currentUser.uid + "_" + user.uid
        : user.uid + "_" + currentUser.uid;

    try {
      const response = await getDoc(doc(db, "chats", threadId));

      if (!response.exists()) {
        // creates an array of chat messages
        await setDoc(doc(db, "private-chats", threadId), {
          members: [currentUser.uid, user.uid],
          createdAt: serverTimestamp(),
          lastMessage: {},
        });
        await setDoc(doc(db, "chats", threadId), {
          messages: [],
        });
        await updateDoc(doc(db, "contacts", currentUser.uid), {
          contactList: arrayUnion({
            id: user.uid,
            dateAdded: Timestamp.now(),
            displayName: user.displayName,
          }),
        });
        await updateDoc(doc(db, "contacts", user.uid), {
          contactList: arrayUnion({
            id: currentUser.uid,
            dateAdded: Timestamp.now(),
            displayName: currentUser.displayName,
          }),
        });
      }
    } catch (err) {
      setError(true);
      console.log(err);
    }

    // Clear the searched user when the user is added
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          onKeyDown={handleEnterKey}
        />
      </div>
      {error && <span>User not found</span>}
      {user && (
        <div className="user-chat" onClick={() => handleStartChat()}>
          <div className="user">
            <div className="user-status"></div>
            <img src={user.photoURL} alt="" />
          </div>
          <div className="user-info">
            <span>{user.userName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
