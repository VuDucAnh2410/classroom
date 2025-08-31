// src/services/firebaseService.js
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export const fetchDocumentsRealtime = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);

  // Lắng nghe dữ liệu thay đổi trong thời gian thực
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    // Gọi callback với dữ liệu mới nhất
    callback(documents);
  });

  // Hàm trả về unsubscribe để có thể dừng lắng nghe khi không cần nữa
  return unsubscribe;
};

// Thêm tài liệu mới vào một bộ sưu tập cụ thể với tùy chọn tải lên hình ảnh
export const addDocument = async (collectionName, values) => {
  try {
 
    await addDoc(collection(db, collectionName), values);
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Update a document in a given collection with an optional image upload
export const updateDocument = async (collectionName, docId, values) => {
 
  await updateDoc(doc(collection(db, collectionName), docId), values);
};

export const deleteDocument = async (collectionName, docId) => {
  
  // Xóa tài liệu khỏi Firestore
  await deleteDoc(doc(collection(db, collectionName), docId));
};