import { Route, Routes } from "react-router-dom";

import ClassDetailPage from "../home/class/ClassDetailPage";
import Home from "../home/home";
import FolderDetailPage from "../home/class/FolderDetailPage";
import LessonsTab from "../home/Tab/LessonTab";
import TabPeople from "../home/Tab/TabPeople";
import TaskDetailPage from "../home/task/TaskDetailPage";

function RouterAdmin() {
  const routers = [
    {
      path: "/",
      element: <Home />,
    },
    {
      // Route mặc định của trang lớp học
      path: "/class/:id",
      element: <ClassDetailPage />,
    },
    {
      // Route cho tab Bài học
      path: "/class/:id/lessons",
      element: (
        <ClassDetailPage>
          <LessonsTab />
        </ClassDetailPage>
      ),
    },
    {
      // Route cho tab Mọi người
      path: "/class/:id/people",
      element: (
        <ClassDetailPage>
          <TabPeople />
        </ClassDetailPage>
      ),
    },
    {
      path: "/class/:id/folder/:folderId",
      element: <FolderDetailPage />,
    },
    {
      path: "/taskdetail/:id",
      element: <TaskDetailPage />,
    },
  ];
  return (
    <>
      <Routes>
        {routers.map((e) => (
          <Route path={e.path} element={e.element} />
        ))}
      </Routes>
    </>
  );
}

export default RouterAdmin;
