import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";

/**
 * Tải một file lên Firebase Storage và trả về URL của nó.
 * @param {File} file - File object để tải lên.
 * @param {string} path - Đường dẫn lưu trữ trên Storage (ví dụ: 'submissions/').
 * @returns {Promise<string>} - Một Promise chứa URL để tải file.
 */
export const uploadFile = async (file, path = "attachments/") => {
  if (!file) throw new Error("No file provided for upload.");

  // Tạo một tham chiếu duy nhất cho file
  const fileRef = ref(storage, `${path}${Date.now()}-${file.name}`);

  try {
    // Tải file lên
    const snapshot = await uploadBytes(fileRef, file);

    // Lấy URL để tải về
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File uploaded successfully, URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
