import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const TasksContext = createContext();

function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("tasks", (list) => {
      setTasks(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <TasksContext.Provider value={tasks}>{children}</TasksContext.Provider>
  );
}
export default TasksProvider;
