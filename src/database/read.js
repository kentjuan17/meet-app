import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserProfile(id) {
  try {
    const docRef = doc(db, "users", id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data();
    }
  } catch {
    return null;
  }
}

export async function getGroupDoc(id) {
  try {
    const docSnap = await getDoc(doc(db, "groups", id));

    return docSnap.exists() && docSnap.data();
  } catch {
    return null;
  }
}

export async function getContactList(id) {
  try {
    const docSnap = await getDoc(doc(db, "contacts", id));

    return docSnap.exists() && docSnap.data();
  } catch {
    return null;
  }
}
