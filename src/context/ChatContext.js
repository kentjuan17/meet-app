import { createContext, useReducer } from "react";

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
          chatId: data.id,
          displayName: data.otherUser.displayName,
          isActive: data.otherUser.isActive,
          photoURL: data.otherUser.photoURL,
          status: data.otherUser.status,
          lastMessage: data.lastMessage,
          type: data.type,
          isNull: false,
        };
      case "LOG_OUT":
        return INITIAL_STATE;
      default:
        return INITIAL_STATE;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
