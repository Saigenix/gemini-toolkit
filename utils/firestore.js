import { app } from "./firebase";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const db = getFirestore(app);

export const GetAllData = async () => {
  const q = query(collection(db, "data"));
  const querySnapshot = await getDocs(q);
  let arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr;
};

export const getDocumentUsingToolID = async (toolID) => {
  try {
    const docRef = doc(db, "data", toolID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: new Error("No such document!") };
    }
  } catch (error) {
    return { data: null, error };
  }
};

export const getDocumentsByUserId = async (userId) => {
  try {
    const q = query(collection(db, "data"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: documents, error: null };
    } else {
      return { data: [], error: null };
    }
  } catch (error) {
    return { data: null, error };
  }
};

export const updateDocumentStatus = async (id, status) => {
  try {
    const docRef = doc(db, "data", id);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating document status:', error);
    return { success: false, error };
  }
};


