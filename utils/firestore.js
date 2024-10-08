import { app } from "./firebase";
import { getFirestore, arrayUnion } from "firebase/firestore";
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
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  useCollection,
  useDocument,

} from "react-firebase-hooks/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";
const db = getFirestore(app);

export const GetAllData = async (filter = "stars") => {
  try {
    // Create a query against the collection
    // Filter for status == true and order by the specified filter
    const q = query(
      collection(db, "data"),
      where("status", "==", true),
      orderBy(filter, "desc")
    );

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
      return { data: docSnap.data(), error: null , id: docSnap.id };
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

export const uploadImageToFirebase = async (file) => {
  try {
    const storage = getStorage(app);
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `images/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      filename: filename,
    };
  } catch (error) {
    console.error("Error uploading image: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateToolDocument = async (documentId, updateData) => {
  try {
    const docRef = doc(db, "data", documentId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date(), // Adding a timestamp for when the document was last updated
    });

    return {
      success: true,
      message: "Document updated successfully",
      error: null,
    };
  } catch (error) {
    console.error("Error updating document: ", error);
    return {
      success: false,
      message: "Failed to update document",
      error: error.message,
    };
  }
};

export const updateToolStatus = async (documentId, newStatus) => {
  try {
    // Ensure newStatus is a boolean
    const status = Boolean(newStatus);

    const docRef = doc(db, "data", documentId);

    await updateDoc(docRef, {
      status: status,
      updatedAt: new Date(), // Adding a timestamp for when the document was last updated
    });

    return {
      success: true,
      message: `Tool status updated to ${status}`,
      error: null,
    };
  } catch (error) {
    console.error("Error updating tool status: ", error);
    return {
      success: false,
      message: "Failed to update tool status",
      error: error.message,
    };
  }
};

// Function to save a tool
export const saveTool = async (userId, toolId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create the document with the toolId in the savedTools array
      await setDoc(userDocRef, { savedTools: [toolId] });
    } else {
      // Update the document by adding the toolId to the savedTools array
      await updateDoc(userDocRef, {
        savedTools: arrayUnion(toolId),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving tool:", error);
    return { success: false, error };
  }
};

// Function to get all saved tools by user ID
export const getSavedTools = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { success: true, savedTools: userData.savedTools || [] };
    } else {
      return { success: false,savedTools: userData.savedTools || [], error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting saved tools:", error);
    return { success: false, error };
  }
};

export const getDocumentsByToolIds = async (toolIds) => {
  try {
    const q = query(collection(db, "users"));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      let res = []
      for (const tool of documents[0].savedTools) {
        // console.log(tool);
        const output = await getDocumentUsingToolID(tool);
        res.push({ ...output.data, id: output.id });
      }
      return { data: res, loading: false, error: null };
    } else {
      return { data: [], loading: false, error: null };
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { data: null, loading: false, error };
  }
};

export const deleteTool = async (documentId) => {
  try {
    const documentRef = doc(db, 'data', documentId);
    await deleteDoc(documentRef);
    return { success: true, message: "Document successfully deleted" };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error };
  }
};