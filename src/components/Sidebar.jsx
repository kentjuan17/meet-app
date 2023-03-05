import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import ChatThreads from "./ChatThreads";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <ChatThreads />
    </div>
  );
};

export default Sidebar;
