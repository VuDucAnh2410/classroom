import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

// Hàm này sẽ xóa một thư mục và tất cả nội dung bên trong nó
export const deleteFolderRecursive = async (folderId) => {
  // Lấy tất cả nodes con
  const nodesQuery = query(
    collection(db, "nodes"),
    where("parent_id", "==", folderId)
  );
  const nodesSnapshot = await getDocs(nodesQuery);

  // Lấy tất cả tasks con
  const tasksQuery = query(
    collection(db, "tasks"),
    where("parent_id", "==", folderId)
  );
  const tasksSnapshot = await getDocs(tasksQuery);

  const batch = writeBatch(db);

  // Xóa các tasks con
  tasksSnapshot.forEach((doc) => {
    // Nếu cần xóa các submission của task, phải query thêm ở đây
    batch.delete(doc.ref);
  });

  // Lặp qua các nodes con
  for (const doc of nodesSnapshot.docs) {
    const nodeData = doc.data();
    if (nodeData.type === "folder") {
      // Nếu node con là một thư mục, gọi lại hàm này để xóa nội dung của nó
      await deleteFolderRecursive(doc.id);
    } else {
      // Nếu là file, thêm vào batch để xóa
      batch.delete(doc.ref);
    }
  }

  // Sau khi xử lý hết các con, xóa chính thư mục gốc (folderId)
  const folderRef = doc(db, "nodes", folderId);
  batch.delete(folderRef);

  // Commit tất cả các thay đổi trong batch
  await batch.commit();
};
