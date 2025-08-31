import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./components/contexts/userProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/contexts/AuthProvider.jsx";
import NodesProvider from "./components/contexts/NodesProvider.jsx";
import SubjectProvider from "./components/contexts/SubjectProvider.jsx";
import SubmissionsProvider from "./components/contexts/SubmissionsProvider.jsx";
import TasksProvider from "./components/contexts/TasksProvider.jsx";
import EnrollmentsProvider from "./components/contexts/EnrollmentsProvider.jsx";
import FolderProvider from "./components/contexts/FolderProvider.jsx";
import NotificationProvider from "./components/contexts/NotificationProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <AuthProvider>
          <NodesProvider>
            <SubjectProvider>
              <SubmissionsProvider>
                <TasksProvider>
                  <EnrollmentsProvider>
                    <FolderProvider>
                      <NotificationProvider>
                        <App />
                      </NotificationProvider>
                    </FolderProvider>
                  </EnrollmentsProvider>
                </TasksProvider>
              </SubmissionsProvider>
            </SubjectProvider>
          </NodesProvider>
        </AuthProvider>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
