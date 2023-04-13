// ChatContext
import { createContext, useReducer, useEffect } from "react";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    chatId: "null",
    displayName: "",
    isActive: false,
    photoURL: false,
    status: "",
    lastMessage: {},
    type: "null",
    isNull: true,
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        const data = action.payload;
        return {
          ...state,
          chatId: data.id,
          displayName: data.otherUser.displayName,
          isActive: data.otherUser.isActive,
          photoURL: data.otherUser.photoURL,
          lastMessage: data.lastMessage,
          type: data.type,
          isNull: false,
        };
      case "UPDATE_USER_STATUS":
        return {
          ...state,
          status: action.status,
        };
      case "LOG_OUT":
        return INITIAL_STATE;
      default:
        return INITIAL_STATE;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const fetchUserStatus = async (chatId) => {
    if (chatId && chatId !== "null") {
      const userDoc = await getDoc(doc(db, "users", chatId));
      if (userDoc.exists()) {
        dispatch({ type: "UPDATE_USER_STATUS", status: userDoc.data().status || "" });
      }
    }
  };

  useEffect(() => {
    if (state.chatId !== "null") {
      fetchUserStatus(state.chatId);
      const userRef = doc(db, "users", state.chatId);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.status !== state.status) {
            dispatch({ type: "UPDATE_USER_STATUS", status: userData.status });
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [state.chatId]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
