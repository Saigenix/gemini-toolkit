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
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    arr.push({ ...doc.data(), id: doc.id });
  });
  //   console.log(arr[0])
  return arr;
};

export const getDocumentUsingToolID =async (toolID) => {
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
