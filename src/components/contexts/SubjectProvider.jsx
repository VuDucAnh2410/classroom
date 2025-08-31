import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const SubjectContext = createContext();

function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("class", (subjectList) => {
      setSubjects(subjectList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SubjectContext.Provider value={subjects}>
      {children}
    </SubjectContext.Provider>
  );
}

export default SubjectProvider;
