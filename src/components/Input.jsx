import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { ChatContext } from "../context/ChatContext";
import {
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
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        (error) => {
          // TODO: error handling
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: url,
              }),
            });
          });
        }
      );
    } else {
      // TODO: delete when done testing
      // console.log(currentUser);
      // console.log(data);

      // adds an input text to the messages array in firebase
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    // TODO: data is being replaced rather than being updated
    await setDoc(
      doc(db, "threads", currentUser.uid),
      {
        [data.chatId]: {
          lastMessageInfo: {
            lastMessage: { text },
            lastMessageDate: serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "threads", data.user.uid),
      {
        [data.chatId]: {
          lastMessageInfo: {
            lastMessage: { text },
            lastMessageDate: serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
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
