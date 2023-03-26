import { useState, useEffect, createContext } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export const CurrentUserContext = createContext();

export const CurrentUserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Stores User Profile
      if (user) {
        const docRef = doc(db, "users", user.uid);
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

  // console.log("Current User Auth:", currentUser);
  // console.log("Current User Data:", currentUserData);

  const value = {
    currentUser,
    currentUserData,
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};
