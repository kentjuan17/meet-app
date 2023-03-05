import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./../firebase";
import { CurrentUserContext } from "./../context/CurrentUserContext";

const Navbar = () => {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div className="navbar">
      <span className="logo">Meet-App</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
