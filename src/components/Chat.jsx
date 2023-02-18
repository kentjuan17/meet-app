import React from 'react'
import More from '../img/more.png'
import Messages from './Messages'
import Input from './Input';

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-info">
        <span>John</span>
        <div className="chat-icons">
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat;
