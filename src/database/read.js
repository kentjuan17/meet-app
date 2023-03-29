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
