import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const EnrollmentsContext = createContext();

function EnrollmentsProvider({ children }) {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("enrollments", (list) => {
      setEnrollments(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <EnrollmentsContext.Provider value={enrollments}>
      {children}
    </EnrollmentsContext.Provider>
  );
}
export default EnrollmentsProvider;
