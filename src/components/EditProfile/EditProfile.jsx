import React, { useContext, useState } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import "./EditProfile.scss";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, setDoc, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { BsPlusCircleFill } from "react-icons/bs";

const EditProfile = () => {
    const { currentUser, currentUserData, updateUserData } = useContext(CurrentUserContext);
    const [newUsername, setNewUsername] = useState(currentUserData.displayName);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [error, setError] = useState("");
    const [previewProfilePicture, setPreviewProfilePicture] = useState(currentUser.photoURL);

    const handleProfilePictureChange = (event) => {
        setNewProfilePicture(event.target.files[0]);

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewProfilePicture(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    const handleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) {
                setError("User not found. Please login again.");
                return;
            }

            const userName = newUsername;
            const userPicture = newProfilePicture;

            if (userName !== currentUser.displayName || userPicture) {
                // Upload new profile picture
                if (userPicture) {
                    const fileName = userName + "-" + Date.now();
                    const storageRef = ref(storage, fileName);

                    const uploadTask = uploadBytesResumable(storageRef, userPicture);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => {
                            setError(`Upload error: ${error.message}`);
                            console.log(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);

                            await updateProfile(user, {
                                displayName: userName,
                                photoURL: url,
                            });

                            await setDoc(doc(db, "users", user.uid), {
                                displayName: userName,
                                photoURL: url,
                            }, { merge: true });

                            updateUserData({ displayName: userName, photoURL: url });

                            setError("");
                        });
                } else {
                    // Update only the displayName
                    await updateProfile(user, {
                        displayName: userName,
                    });

                    await setDoc(doc(db, "users", user.uid), {
                        displayName: userName,
                    }, { merge: true });

                    setError("");
                }
            }
        } catch (error) {
            setError(`Update error: ${error.message}`);
        }
    };



    return (
        <div className="edit-profile">
            <form onSubmit={handleSaveChanges}>
                <span className="title">Edit Profile</span>
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="avatar"
                    onChange={handleProfilePictureChange}
                />
                <label className="avatar" htmlFor="avatar">
                    <img src={previewProfilePicture} alt="" />
                    <button><BsPlusCircleFill /></button>
                </label>
                <label className="text-input" htmlFor="username">Username</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    value={newUsername}
                    onChange={handleUsernameChange}
                />
                <label className="text-input" htmlFor="username">About</label>
                <input
                    type="text"
                    placeholder="Enter status"
                />
                {/* Add input field for changing the picture */}
                <button>Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;