import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const SubmissionsContext = createContext();

function SubmissionsProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("submissions", (list) => {
      setSubmissions(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SubmissionsContext.Provider value={submissions}>
      {children}
    </SubmissionsContext.Provider>
  );
}
export default SubmissionsProvider;
