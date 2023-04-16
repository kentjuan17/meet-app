import React from "react";
import Sidebar from "../components/Sidebar";
import WelcomeScreen from "../components/WelcomeScreen";
import Chat from "../components/Chat";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export const Home = () => {
  const { data } = useContext(ChatContext);

  // console.log("Home Comp:", data);
  return (
    <div className="home-container">
      <div className="container">
        <Sidebar />
        {data.isNull && <WelcomeScreen />}
        {!data.isNull && <Chat />}
      </div>
    </div>
  );
};
