import React, { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const FolderContext = createContext();

function FolderProvider({ children }) {
  const [folder, setFolder] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("folder", (list) => {
      setFolder(list);
    });
    return () => unsubscribe();
  }, []);

  console.log(folder);
  return (
    <FolderContext.Provider value={folder}>{children}</FolderContext.Provider>
  );
}

export default FolderProvider;
