import React from 'react'

const Search = () => {
  return (
    <div className="search">
      <div className="search-container">
        <input type="text" placeholder="Find users" />
      </div>
      {/***** Sample User *****/}
      <div className="user-chat">
        <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
        <div className="user-info">
          <span>John</span>
        </div>
      </div>
    </div>
  )
}

export default Search;
