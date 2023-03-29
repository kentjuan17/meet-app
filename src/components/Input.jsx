import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { ChatContext } from "../context/ChatContext";
import {
  addDoc,
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(CurrentUserContext);
  const { data } = useContext(ChatContext);

  const handleSendMessage = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          (error) => {
            // TODO: error handling
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    sentAt: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else {
        // TODO: delete when done testing
        // console.log(currentUser);
        // console.log(data);

        // adds an input text to the messages array in firebase
        const saveToChats = await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            sentAt: Timestamp.now(),
          }),
        });
        console.log("save to chat", saveToChats);
      }

      const saveToPrivate = await setDoc(
        doc(db, "private-chats", data.chatId),
        {
          lastMessage: {
            text,
            sentAt: serverTimestamp(),
            senderId: currentUser.uid,
          },
        },
        { merge: true }
      );
      console.log("savetoprivate:", saveToPrivate);

      setText("");
      setImg(null);
    } catch (error) {
      throw new Error(error);
    }
  };

  // proceed to search the user when "enter" key was pressed
  const handleEnterKey = (e) => e.code === "Enter" && handleSendMessage();

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleEnterKey}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Input;
