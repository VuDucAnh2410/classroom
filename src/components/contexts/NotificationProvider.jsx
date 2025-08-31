import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("notifications", (userList) => {
      setNotifications(userList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
