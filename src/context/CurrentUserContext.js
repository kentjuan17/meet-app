import { useState, useEffect, createContext } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const CurrentUserContext = createContext();

export const CurrentUserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});
  // const [privateMessages, setPrivateMessages] = useState([]);
  // const [groups, setGroups] = useState([]);

  // Current User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Stores User Profile
      if (user) {
        const docRef = doc(db, "users", user.uid);
        // set active status when user logs in
        updateDoc(docRef, { isActive: true })
          .then(() => console.log("isActive changed to true"))
          .catch((err) => console.log(err));

        getDoc(docRef)
          .then((doc) => {
            doc.exists && setCurrentUserData(doc.data());
          })
          .catch((err) => console.log(err));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateUserData = (newData) => {
    setCurrentUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Private Message
  // useEffect(() => {
  //   const getThreads = async () => {
  //     const querySnapshot = await getDocs(collection(db, "threads"));
  //     querySnapshot.forEach((doc) => {
  //       console.log("threads: ", doc.id, " => ", doc.data());
  //     });
  //   };

  //   currentUser && getThreads();
  // }, [currentUser]);

  // // Group
  // useEffect(() => {
  //   const q = query(
  //     collection(db, "groups"),
  //     where("members", "array-contains", currentUser.uid)
  //   );
  //   const unsub = onSnapshot(q, (qSnap) => {
  //     const groups = [];
  //     qSnap.forEach((doc) => {
  //       if (!doc.exists()) return console.log("NO DATA");

  //       const data = doc.data();
  //       groups.push({
  //         id: doc.id,
  //         name: data.name,
  //         members: data.members,
  //         createdAt: data.createdAt.toMillis(),
  //       });

  //       console.log(groups);
  //     });
  //     // setGroups(groups);
  //   });

  //   return () => unsub();
  // }, [currentUser]);

  // console.log("Current User Auth:", currentUser);
  // console.log("Current User Data:", currentUserData);

  // Log Out user function
  const logout = async () => {
    try {
      // Update the user's isActive status to false
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { isActive: false });

      // sign out user and reset all state
      signOut(auth)
        .then(() => {
          setCurrentUserData({});
          console.log("Sign Out ok");
        })
        .catch((err) => console.log("sign out failed: ", err));
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    currentUser,
    currentUserData,
    logout,
    updateUserData,
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};
