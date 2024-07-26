import { app } from './firebase'
import { getFirestore } from "firebase/firestore";
import { doc, addDoc,collection,updateDoc } from "firebase/firestore";
import {query, where, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export const GetAllData = async () => {
  const q = query(collection(db, "data"));
  const querySnapshot = await getDocs(q);
  let arr = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    arr.push(doc.data());
  });
//   console.log(arr[0])
  return arr;
};