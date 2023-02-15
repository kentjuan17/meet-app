import React from 'react'

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Chat App</span>
      {/***** Sample User *****/}
      <div className="user">
        <img src="https://unsplash.com/photos/X6Uj51n5CE8" alt="" />
        <span>User</span>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Navbar;
