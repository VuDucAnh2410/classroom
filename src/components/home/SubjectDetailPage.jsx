"use client";

import React, { useContext, useState, useEffect } from "react";
import { NodeContext } from "../contexts/NodesProvider";
import { LoginContext } from "../contexts/AuthProvider";
import { IoMdMore } from "react-icons/io";
import {
  MdFolder,
  MdInsertDriveFile,
  MdRefresh,
  MdContentCopy,
  MdClose,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { Menu, MenuItem, IconButton } from "@mui/material";
import CommentModal from "./CommentModal";
import CreateTaskModal from "./CreateTaskModal";
import CreateTopicModal from "./CreateTopicModal";
import BreadcrumbNavigation from "./BreadcrumbNavigation";
import {
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/firebaseService";
import { UserContext } from "../contexts/UserProvider";
import TaskDetailView from "./TaskDetailView";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AddNodeDialog = ({ open, onClose, onAdd, parentId, nodeType }) => {
  const [name, setName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        teacherName: teacherName.trim(),
        description: description.trim(),
        parent_id: parentId,
        type: nodeType,
      });
      setName("");
      setTeacherName("");
      setDescription("");
      onClose();
    }
  };

  const getDialogTitle = () => {
    return nodeType === "folder" ? "Thêm thư mục mới" : "Thêm tệp mới";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {getDialogTitle()}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={nodeType === "folder" ? "Tên thư mục" : "Tên tệp"}
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {nodeType === "file" && (
          <>
            <TextField
              margin="dense"
              label="Tên giáo viên (không bắt buộc)"
              fullWidth
              variant="outlined"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Mô tả (không bắt buộc)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditNodeDialog = ({ open, onClose, onEdit, node }) => {
  const [name, setName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (node) {
      setName(node.name || node.classname || "");
      setTeacherName(node.teachername || "");
      setDescription(node.description || "");
    }
  }, [node]);

  const handleSubmit = () => {
    if (name.trim()) {
      onEdit(node.id, {
        name: name.trim(),
        classname: name.trim(),
        teachername: teacherName.trim(),
        description: description.trim(),
      });
      onClose();
    }
  };

  const getDialogTitle = () => {
    return node?.type === "folder" ? "Sửa thư mục" : "Sửa tệp";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {getDialogTitle()}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={node?.type === "folder" ? "Tên thư mục" : "Tên tệp"}
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {node?.type === "file" && (
          <>
            <TextField
              margin="dense"
              label="Tên giáo viên (không bắt buộc)"
              fullWidth
              variant="outlined"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Mô tả (không bắt buộc)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ open, onClose, onDelete, node }) => {
  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa{" "}
          {node?.type === "folder" ? "thư mục" : "tệp"} "
          {node?.name || node?.classname}"?
          {node?.type === "folder" && (
            <Typography color="error" sx={{ mt: 1 }}>
              Lưu ý: Tất cả các thư mục và tệp con bên trong cũng sẽ bị xóa!
            </Typography>
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "class", label: "Lớp học" },
    { id: "lessons", label: "Bài học" },
    { id: "people", label: "Mọi người" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const CommentBar = ({ onCreateFolder, onCreateFile, onRefresh, onComment }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <button
            onClick={onComment}
            className="flex-1 text-left text-gray-500 bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            Thông báo cho lớp học
          </button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <IconButton onClick={onCreateFile} size="small" title="Tạo tệp">
            <MdInsertDriveFile className="text-blue-600" />
          </IconButton>
          <IconButton onClick={onCreateFolder} size="small" title="Tạo thư mục">
            <MdFolder className="text-orange-500" />
          </IconButton>
          <IconButton onClick={onRefresh} size="small" title="Làm mới">
            <MdRefresh className="text-gray-600" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const SubjectItem = ({ item, onClick, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(item);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(item);
    handleMenuClose();
  };

  const isFolder = item.type === "folder";
  const isFile = item.type === "file";
  const isComment = item.type === "comment";

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isFolder ? (
            <MdFolder className="text-blue-500" size={24} />
          ) : (
            <MdInsertDriveFile className="text-gray-600" size={24} />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {item.name || item.title || "Không có tiêu đề"}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
        </div>
        <IconButton onClick={handleMenuClick} size="small">
          <IoMdMore />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          {(isFolder || isFile) && (
            <MenuItem onClick={handleEdit}>Sửa</MenuItem>
          )}
          {(isFolder || isFile) && (
            <MenuItem onClick={handleDelete}>Xóa</MenuItem>
          )}
          {isComment && <MenuItem disabled>Không có thao tác</MenuItem>}
        </Menu>
      </div>
    </div>
  );
};

const SubjectDetailPage = ({ subjectInfo, onBack }) => {
  const [activeTab, setActiveTab] = useState("class");
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createTopicModalOpen, setCreateTopicModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentPath, setCurrentPath] = useState([subjectInfo]);
  const [currentView, setCurrentView] = useState("subjectDetail");
  const [selectedTask, setSelectedTask] = useState(null);

  const nodes = useContext(NodeContext);
  const users = useContext(UserContext);
  const { auth } = useContext(LoginContext);

  const currentFolder = currentPath[currentPath.length - 1];

  const subjectItems = nodes
    .filter((node) => node.parent_id === currentFolder.id)
    .sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

  const comments = nodes.filter(
    (node) => node.type === "comment" && node.parent_id === currentFolder.id
  );
  const topics = nodes.filter(
    (node) => node.type === "folder" && node.parent_id === currentFolder.id
  );

  const upcomingTasks = nodes
    .filter(
      (node) =>
        node.class_id === subjectInfo.class_id &&
        node.type === "file" &&
        node.endDate &&
        new Date(node.endDate) > new Date()
    )
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const getParentChain = (node) => {
    const parentChain = [];
    let currentNode = node;
    while (currentNode && currentNode.parent_id) {
      const parentNode = nodes.find((n) => n.id === currentNode.parent_id);
      if (parentNode) {
        parentChain.unshift(parentNode);
        currentNode = parentNode;
      } else {
        currentNode = null;
      }
    }
    return parentChain;
  };

  const handleBreadcrumbClick = (node, index) => {
    if (index === 0) {
      onBack();
    } else {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", onClick: onBack },
    ...getParentChain(currentFolder).map((node) => ({
      label: node.name,
      onClick: () => handleNavigateToNode(node),
    })),
    {
      label: currentFolder.name,
      onClick: null,
    },
  ];

  const handleNavigateToNode = (node) => {
    if (node.type === "file") {
      setSelectedTask(node);
      setCurrentView("taskDetail");
    } else if (node.type === "folder") {
      const pathIndex = currentPath.findIndex((n) => n.id === node.id);
      if (pathIndex !== -1) {
        setCurrentPath(currentPath.slice(0, pathIndex + 1));
      } else {
        setCurrentPath([...currentPath, node]);
      }
    }
  };

  const handleBackFromTaskDetail = () => {
    setCurrentView("subjectDetail");
    setSelectedTask(null);
  };

  const handleEditNode = (node) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleDeleteNode = (node) => {
    setSelectedNode(node);
    setDeleteDialogOpen(true);
  };

  const handleUpdateNode = async (nodeId, updateData) => {
    try {
      await updateDocument("nodes", nodeId, updateData);
    } catch (error) {
      console.error("Lỗi khi cập nhật node:", error);
      alert("Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleDeleteNodeConfirm = async (nodeId) => {
    try {
      const childNodes = nodes.filter((node) => node.parent_id === nodeId);
      for (const child of childNodes) {
        await handleDeleteNodeConfirm(child.id);
      }
      await deleteDocument("nodes", nodeId);
      console.log("Node deleted successfully");
    } catch (error) {
      console.error("Lỗi khi xóa node:", error);
      alert("Có lỗi xảy ra khi xóa");
    }
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      const commentNode = {
        name: "Thông báo cho lớp học",
        type: "comment",
        parent_id: currentFolder.id,
        user_id: auth?.uid || auth?.id,
        content: commentData.content,
        recipient: commentData.recipient,
        attachments: commentData.attachments,
        timestamp: commentData.timestamp,
        class_id: subjectInfo.class_id || subjectInfo.id,
      };
      await addDocument("nodes", commentNode);
      console.log("Comment created successfully:", commentNode);
      alert("Đã gửi thông báo thành công!");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Lỗi khi gửi thông báo!");
    }
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const parentNodeId = taskData.topic || currentFolder.id;
      const taskNode = {
        name: taskData.title,
        type: "file",
        parent_id: parentNodeId,
        user_id: auth?.uid || auth?.id,
        content: taskData.content,
        recipient: taskData.recipient,
        topic: taskData.topic,
        attachments: taskData.attachments,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        timestamp: taskData.timestamp,
        class_id: subjectInfo.class_id || subjectInfo.id,
      };
      await addDocument("nodes", taskNode);
      alert("Đã tạo bài tập thành công!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Lỗi khi tạo bài tập!");
    }
  };

  const handleTopicSubmit = async (topicData) => {
    try {
      const topicNode = {
        name: topicData.name,
        timestamp: new Date().toISOString(),
        class_id: subjectInfo.class_id || subjectInfo.id,
      };
      await addDocument("folder", topicNode);
      alert("Đã tạo chủ đề thành công!");
    } catch (error) {
      console.error("Error creating topic:", error);
      alert("Lỗi khi tạo chủ đề!");
    }
  };

  const handleLeaveClass = async () => {
    const confirmLeave = window.confirm(
      "Bạn có chắc chắn muốn rời khỏi lớp học này không?"
    );
    if (confirmLeave) {
      try {
        const enrollmentRecord = nodes.find(
          (node) =>
            node.type === "enrollment" &&
            node.user_id === auth.uid &&
            node.class_id === subjectInfo.class_id
        );
        if (enrollmentRecord) {
          await deleteDocument("nodes", enrollmentRecord.id);
          alert("Bạn đã rời lớp thành công.");
          onBack();
        } else {
          alert("Không tìm thấy thông tin đăng ký lớp học.");
        }
      } catch (error) {
        console.error("Lỗi khi rời lớp:", error);
        alert("Có lỗi xảy ra khi rời lớp.");
      }
    }
  };

  if (currentView === "taskDetail" && selectedTask) {
    return (
      <TaskDetailView
        taskInfo={selectedTask}
        onBack={handleBackFromTaskDetail}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "class":
        return (
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const author = users.find(
                  (user) =>
                    user.uid === comment.user_id || user.id === comment.user_id
                );
                return (
                  <div
                    key={comment.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {author?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {author?.username || "Người dùng"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        {comment.attachments &&
                          comment.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-sm font-medium text-gray-600">
                                Tệp đính kèm:
                              </p>
                              {comment.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <MdInsertDriveFile size={16} />
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {attachment.label}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có thông báo nào</p>
              </div>
            )}
            {subjectItems.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Bài tập và Chủ đề
                </Typography>
                {subjectItems.map((item) => (
                  <SubjectItem
                    key={item.id}
                    item={item}
                    onClick={() => handleNavigateToNode(item)}
                    onEdit={handleEditNode}
                    onDelete={handleDeleteNode}
                  />
                ))}
              </Box>
            )}
          </div>
        );
      case "lessons":
      case "people":
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Nội dung sẽ được hiển thị ở đây</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <BreadcrumbNavigation items={breadcrumbItems} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Mã lớp học:
            </Typography>
            <Typography variant="body1">{subjectInfo.class_id}</Typography>
            <IconButton
              onClick={() =>
                navigator.clipboard.writeText(subjectInfo.class_id)
              }
              size="small"
            >
              <MdContentCopy size={16} />
            </IconButton>
          </Box>
        </Box>
        {/* Subject Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div
            className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative"
            style={{
              backgroundImage:
                "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nIy7kC7C73IShBMiETla91lzS3QBJI.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">
                {subjectInfo.name || subjectInfo.classname || "Môn học"}
              </h1>
              <p className="text-sm opacity-90">
                {subjectInfo.description || "Chương 1."}
              </p>
            </div>
          </div>
          <div className="p-6">
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <CommentBar
              onCreateFolder={() => setCreateTopicModalOpen(true)}
              onCreateFile={() => setCreateTaskModalOpen(true)}
              onRefresh={() => window.location.reload()}
              onComment={() => setCommentModalOpen(true)}
            />
            {renderTabContent()}
          </div>
        </div>

        {/* Các Modal */}
        <CommentModal
          open={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          onSubmit={handleCommentSubmit}
          recipients={users || []}
        />
        <CreateTaskModal
          open={createTaskModalOpen}
          onClose={() => setCreateTaskModalOpen(false)}
          onSubmit={handleTaskSubmit}
          recipients={users}
          topics={topics}
        />
        <CreateTopicModal
          open={createTopicModalOpen}
          onClose={() => setCreateTopicModalOpen(false)}
          onSubmit={handleTopicSubmit}
        />
        <EditNodeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onEdit={handleUpdateNode}
          node={selectedNode}
        />
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDeleteNodeConfirm}
          node={selectedNode}
        />
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: 300, lg: 384 },
          p: { xs: 2, md: 3 },
          borderLeft: 1,
          borderColor: "divider",
          backgroundColor: "white",
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Lời nhắc:
        </Typography>
        <hr className="my-2" />
        {upcomingTasks.length > 0 ? (
          <Box className="mt-4 space-y-4">
            {upcomingTasks.map((task) => (
              <Box
                key={task.id}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <Typography variant="body2" fontWeight={600}>
                  {task.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hạn nộp: {new Date(task.endDate).toLocaleString("vi-VN")}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="text-center py-4">
            <Typography variant="body2" color="text.secondary">
              Không có bài tập sắp đến hạn.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubjectDetailPage;
