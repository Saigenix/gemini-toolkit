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
  getDoc,
  increment,
  orderBy,  
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const db = getFirestore(app);

export const GetAllData = async (filter = "stars") => {
  try {
    const q = query(collection(db, "data"), orderBy(filter, "desc"));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });
    return arr;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
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
    console.error("Error updating document status:", error);
    return { success: false, error };
  }
};

export const saveTool = async (userId, toolId) => {
  try {
    // needs implementation
    // const userDocRef = doc(db, "users", userId);
    // await updateDoc(userDocRef, {
    //   savedTools: arrayUnion(toolId),
    // });
    // return { success: true };
  } catch (error) {
    console.error("Error saving tool:", error);
    return { success: false, error };
  }
};

export const addSimpleTool = async ({
  additional,
  creatorName,
  description,
  img,
  prompts,
  stars,
  status,
  toolName,
  type,
  userId,
}) => {
  try {
    const docRef = await addDoc(collection(db, "data"), {
      additional,
      creatorName,
      description,
      img,
      prompts,
      stars,
      status,
      toolName,
      type,
      userId,
      createdAt: new Date(),
    });

    return {
      success: true,
      id: docRef.id,
      error: null,
    };
  } catch (error) {
    console.error("Error adding document: ", error);
    return {
      success: false,
      id: null,
      error: error.message,
    };
  }
};

export const updateStars = async (toolId, incrementBy = 1) => {
  try {
    // Reference to the tool document
    const toolRef = doc(db, "data", toolId);

    // Update the star count
    await updateDoc(toolRef, {
      stars: increment(incrementBy),
    });

    return {
      success: true,
      message: `Stars ${
        incrementBy > 0 ? "increased" : "decreased"
      } successfully.`,
    };
  } catch (error) {
    console.error("Error updating stars: ", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
