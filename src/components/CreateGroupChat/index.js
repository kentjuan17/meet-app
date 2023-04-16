import React, { useState } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const CreateGroupChat = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSelectContact = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(groupName, selectedContacts);
  };

  return (
    <div className="create-group-chat">
      <Link to="/">
        <BsFillArrowLeftCircleFill className="back-icon" />
      </Link>
      <form onSubmit={handleSubmit}>
        <span className="title">Add Group Participants</span>
        <label htmlFor="group-name-input">Group Name:</label>
        <input
          id="group-name-input"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <h3>Select contacts:</h3>
        <ul>
          <li onClick={(e) => handleSelectContact(e.target.value)}>Test</li>
          <li onClick={(e) => handleSelectContact(e.target.value)}>Test1</li>
          <li onClick={(e) => handleSelectContact(e.target.value)}>Test2</li>
          <li onClick={(e) => handleSelectContact(e.target.value)}>Test3</li>
        </ul>
        <button type="submit">Create Group Chat</button>
      </form>
    </div>
  );
};

export default CreateGroupChat;
