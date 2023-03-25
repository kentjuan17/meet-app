import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

export const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};
