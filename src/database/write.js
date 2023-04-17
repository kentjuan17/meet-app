import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export async function addGroupDoc(data) {
  try {
    const docRef = await addDoc(collection(db, "groups"), data);
    return docRef.id;
  } catch {
    return null;
  }
}
