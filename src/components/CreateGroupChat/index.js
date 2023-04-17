import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import * as database from "./../../database";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { Timestamp } from "firebase/firestore";

const CreateGroupChat = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const getContacts = await database.getContactList(currentUser.uid);

      if (getContacts !== null) {
        setContacts(getContacts.contactList);
      }
    })();
  }, [currentUser]);

  const handleSelectContact = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (groupName && selectedContacts) {
      // console.log(groupName, selectedContacts);
      const getUserIds = selectedContacts.map((contact) => contact.id);

      const data = {
        createdAt: Timestamp.now(),
        createdBy: currentUser.uid,
        members: [currentUser.uid, ...getUserIds],
        lastMessage: {},
        name: groupName,
      };
      console.log(data);
      const savedId = await database.addGroupDoc(data);

      if (savedId) {
        data.id = savedId;

        navigate("/");

        // Clear the form
        setGroupName("");
        setSelectedContacts([]);
      }
    }
  };

  return (
    <div className="create-group-chat">
      <Link to="/">
        <BsFillArrowLeftCircleFill className="back-icon" />
      </Link>
      <form onSubmit={handleSubmit}>
        <span className="title">Add Group Participants</span>
        <span className="text-input">Select Contacts</span>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              style={{
                fontWeight: selectedContacts.includes(contact)
                  ? "bold"
                  : "normal",
              }}
            >
              {contact.displayName}
            </li>
          ))}
        </ul>
        <label htmlFor="group-name-input" className="text-input">
          Group Name
        </label>
        <input
          id="group-name-input"
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <button type="submit">Create Group Chat</button>
      </form>
    </div>
  );
};

export default CreateGroupChat;
