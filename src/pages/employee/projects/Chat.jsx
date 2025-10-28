import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoAttach, IoClose, IoCheckmarkDone, IoDocumentText } from "react-icons/io5";
import {
  FaProjectDiagram,
  FaBars,
  FaTimes,
  FaComments,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaReply,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaCheck,
} from "react-icons/fa";
import logo from "/login_logo.png";

import {
  sendmessage,
  getmessage,
  updatemessage,
  deletemessage,
} from "../../../api/employee/chat";
import { getOngoingProjects } from "../../../api/employee/assignProject";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const messageListRef = useRef(null);
  const editTextareaRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showOptionsForMessage, setShowOptionsForMessage] = useState(null);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchAssignedProjects();
    try {
      const userIdString = localStorage.getItem("userId");
      if (userIdString) {
        const userIdInt = parseInt(userIdString, 10);
        setCurrentUserId(userIdInt);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);

    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectMessages(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [currentMessages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showOptionsForMessage &&
        !event.target.closest(".message-options-menu")
      ) {
        setShowOptionsForMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptionsForMessage]);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await getOngoingProjects();

      console.log("Full API Response:", response); // Debug log
      console.log("Response.projects:", response.projects); // Debug log

      if (response.success && response.projects) {
        console.log("Total projects received:", response.projects.length); // Debug log
        
        // Log all work statuses to see what we're getting
        response.projects.forEach((assignment, index) => {
          console.log(`Project ${index + 1} workStatus:`, assignment.workStatus);
        });

        const acceptedProjects = response.projects.filter(
          (assignment) =>
            assignment.workStatus === "in_progress"
        );

        console.log("Filtered in_progress projects:", acceptedProjects.length); // Debug log

        const formattedProjects = acceptedProjects.map((assignment) => ({
          id: assignment.project.id,
          name: assignment.project.name,
          description: assignment.project.description,
          assignmentId: assignment.id,
        }));

        console.log("Formatted projects:", formattedProjects); // Debug log

        setProjects(formattedProjects);
        if (formattedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(formattedProjects[0].id);
        }
      } else {
        console.error("Invalid response structure or no success flag:", response);
        setError("Failed to load projects. Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.error("Error details:", error.response || error.message);
      setError(error.response?.data?.message || error.message || "Failed to fetch assigned projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMessages = async (projectId) => {
    try {
      setLoading(true);
      setCurrentMessages([]);
      const response = await getmessage(projectId);

      if (response.success && response.data) {
        const formattedMessages = response.data.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.sender?.fullName || "Unknown",
          senderImage: msg.sender?.profileImage,
          position: msg.sender?.position,
          attachments: msg.attachments,
          isEdited: msg.isEdited,
          createdAt: msg.createdAt,
          replyCount: msg.replyCount || 0,
        }));

        setCurrentMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      e.target.value = null;
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-400" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-400" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-purple-400" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

const handleSendMessage = async (e) => {
    e.preventDefault();
    // Allow sending if EITHER message OR files exist (and project is selected)
    if ((!message.trim() && selectedFiles.length === 0) || !selectedProjectId) return;

    const messageToSend = message;
    const filesToSend = [...selectedFiles];
    const replyToMessage = replyingTo;

    const tempId = Date.now();
    const newMessageOptimistic = {
      id: tempId,
      content: messageToSend,
      senderId: currentUserId,
      senderName: "You",
      senderImage: null,
      position: null,
      attachments: filesToSend.map(file => ({ 
        name: file.name, 
        size: file.size, 
        url: URL.createObjectURL(file), 
        temp: true 
      })),
      isEdited: false,
      createdAt: new Date().toISOString(),
      replyCount: 0,
      sending: true,
      replyTo: replyToMessage ? {
        id: replyToMessage.id,
        content: replyToMessage.content,
        senderName: replyToMessage.senderName
      } : null,
    };

    setCurrentMessages(prevMessages => [...prevMessages, newMessageOptimistic]);
    setMessage("");
    setSelectedFiles([]);
    setReplyingTo(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }

    try {
      setSendingMessage(true);
      const formData = new FormData();

      // Append content if it exists
      if (messageToSend.trim()) {
         formData.append("content", messageToSend);
      }
      
      formData.append("projectId", selectedProjectId);

      // Append reply information if replying
      if (replyToMessage) {
        formData.append("replyToMessageId", replyToMessage.id);
      }

      // Append multiple files
      if (filesToSend.length > 0) {
        filesToSend.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      console.log('FormData entries:', [...formData.entries()]);

      const response = await sendmessage(formData);

      if (response.success && response.data) {
        const sentMessage = response.data;
        const formattedSentMessage = {
          id: sentMessage.id,
          content: sentMessage.content,
          senderId: sentMessage.senderId,
          senderName: sentMessage.sender?.fullName || "Unknown",
          senderImage: sentMessage.sender?.profileImage,
          position: sentMessage.sender?.position,
          attachments: sentMessage.attachments,
          isEdited: sentMessage.isEdited,
          createdAt: sentMessage.createdAt,
          replyCount: sentMessage.replyCount || 0,
          replyTo: sentMessage.replyTo,
        };
        setCurrentMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === tempId ? formattedSentMessage : msg
          )
        );
      } else {
        setCurrentMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== tempId)
        );
        console.error("Failed to send message:", response.message || "Unknown error");
        setMessage(messageToSend);
        setSelectedFiles(filesToSend);
        setReplyingTo(replyToMessage);
      }
    } catch (error) {
      setCurrentMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== tempId)
      );
      console.error("Error sending message:", error.message || "Failed to send message");
      setMessage(messageToSend);
      setSelectedFiles(filesToSend);
      setReplyingTo(replyToMessage);
    } finally {
      setSendingMessage(false);
    }
  };


  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setIsSidebarOpen(false);
  };
  const handleEditMessage = (msg) => {
    setEditingMessageId(msg.id);
    setEditingContent(msg.content);
    setShowOptionsForMessage(null);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
        editTextareaRef.current.setSelectionRange(
          editTextareaRef.current.value.length,
          editTextareaRef.current.value.length
        );
      }
    }, 0);
  };

  const handleReplyMessage = (msg) => {
    setReplyingTo(msg);
    setShowOptionsForMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (messageId) => {
    if (!editingContent.trim()) {
      console.error("Message cannot be empty");
      return;
    }
    const originalContent = currentMessages.find(msg => msg.id === messageId)?.content;

    setCurrentMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, content: editingContent, isEdited: true } : msg
      )
    );
    setEditingMessageId(null);
    setEditingContent("");


    try {
      const response = await updatemessage(
        { content: editingContent },
        messageId
      );

      if (!response.success) {
        setCurrentMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, content: originalContent, isEdited: msg.isEdited } : msg
          )
        );
        console.error("Failed to update message:", response.message || "Unknown error");
      }
    } catch (error) {
      setCurrentMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, content: originalContent, isEdited: msg.isEdited } : msg
        )
      );
      console.error("Error updating message:", error.message || "Failed to update message");
    }
  };


  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      setShowOptionsForMessage(null);
      return;
    }

    const originalMessages = [...currentMessages];
    setCurrentMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    setShowOptionsForMessage(null);


    try {
      const response = await deletemessage(messageId);

      if (!response.success) {

        setCurrentMessages(originalMessages);
        console.error("Failed to delete message:", response.message || "Unknown error");
      }

    } catch (error) {

      setCurrentMessages(originalMessages);
      console.error("Error deleting message:", error.message || "Failed to delete message");

    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const ProjectSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-5 h-5 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded flex-1"></div>
      </div>
      <div className="h-3 bg-gray-700 rounded w-3/4 ml-8"></div>
    </div>
  );

  const MessageSkeleton = ({ isRight }) => (
    <div
      className={`flex flex-col ${isRight ? "items-end" : "items-start"
        } animate-pulse`}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        {!isRight && <div className="w-6 h-6 bg-gray-700 rounded-full"></div>}
        <div className="h-3 bg-gray-700 rounded w-20"></div>
      </div>
      <div
        className={`p-3 rounded-lg w-64 h-16 ${isRight
          ? "bg-purple-600/50 rounded-tr-none"
          : "bg-gray-700/50 rounded-tl-none"
          }`}
      ></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
        fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col z-50
        w-4/5 max-w-xs transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:w-1/3 md:z-auto
        lg:w-1/4 /* Adjusted width for large screens */
      `}
      >
        <div className="p-4 border-b border-gray-700 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center ms-16">
            <img src={logo} alt="Logo" className="w-16 object-contain" />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {error && (
            <div className="p-4 m-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              <p className="font-semibold">Error loading projects:</p>
              <p>{error}</p>
              <button
                onClick={fetchAssignedProjects}
                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Retry
              </button>
            </div>
          )}
          {loading && projects.length === 0 ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <FaProjectDiagram className="mx-auto mb-2 text-4xl" />
              <p>No projects assigned</p>
              <p className="text-xs mt-2 text-gray-500">
                Projects with "in_progress" status will appear here
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`block p-4 cursor-pointer border-l-4 ${selectedProjectId === project.id
                  ? "border-purple-500 bg-gray-700/50"
                  : "border-transparent hover:bg-gray-700/30"
                  }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <FaProjectDiagram className="text-purple-400 shrink-0" />
                  <h3 className="font-semibold truncate flex-1">
                    {project.name}
                  </h3>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-400 truncate pl-7">
                    {project.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full w-full md:w-2/3 lg:w-3/4">
        <div className="p-4 border-b border-gray-700 flex-shrink-0 bg-gray-800 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-4 text-gray-400 hover:text-white"
          >
            <FaBars size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {selectedProject?.name || "Select a Project"}
            </h2>
            {selectedProject && (
              <p className="text-sm text-gray-400 mt-1">
                Project Chat - All team members can view and reply
              </p>
            )}
          </div>
        </div>

        <div
          ref={messageListRef}
          className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-900"
        >
          {loading ? (
            <div className="space-y-4">
              <MessageSkeleton isRight={false} />
              <MessageSkeleton isRight={true} />
              <MessageSkeleton isRight={false} />
            </div>
          ) : currentMessages.length > 0 ? (
            currentMessages.map((msg) => {
              const isMyMessage =
                currentUserId && msg.senderId === currentUserId;
              const isEditing = editingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`flex flex-col max-w-[75%] sm:max-w-xl ${isMyMessage ? "items-end" : "items-start"
                      }`}
                  >
                    {!isMyMessage && (
                      <div className="flex items-center gap-2 mb-1 px-1">
                        {msg.senderImage && (
                          <img
                            src={msg.senderImage}
                            alt={msg.senderName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-xs text-gray-400 font-semibold">
                          {msg.senderName}
                          {msg.position && (
                            <span className="ml-1 font-normal">
                              ({msg.position})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="relative group flex items-start w-full">
                      {isMyMessage && !isEditing && (
                        <div className="relative message-options-menu">
                          <button
                            onClick={() =>
                              setShowOptionsForMessage(
                                showOptionsForMessage === msg.id ? null : msg.id
                              )
                            }
                            className="p-2 mr-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaEllipsisV size={14} />
                          </button>
                          {showOptionsForMessage === msg.id && (
                            <div className="absolute right-0 -mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[140px]">
                              <button
                                onClick={() => handleReplyMessage(msg)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-green-400 rounded-t-lg"
                              >
                                <FaReply /> Reply
                              </button>
                              <button
                                onClick={() => handleEditMessage(msg)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-blue-400"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-red-400 rounded-b-lg"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {!isMyMessage && !isEditing && (
                        <div className="relative message-options-menu">
                          <button
                            onClick={() =>
                              setShowOptionsForMessage(
                                showOptionsForMessage === msg.id ? null : msg.id
                              )
                            }
                            className="p-2 ml-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaEllipsisV size={14} />
                          </button>
                          {showOptionsForMessage === msg.id && (
                            <div className="absolute left-0 -mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[140px]">
                              <button
                                onClick={() => handleReplyMessage(msg)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-green-400 rounded-lg"
                              >
                                <FaReply /> Reply
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`relative flex-1 rounded-lg text-sm md:text-base break-words shadow-lg ${isMyMessage
                          ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-none"
                          : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-tl-none"
                          }`}
                      >
                        {isEditing ? (
                          <div className="p-4 space-y-3 bg-gray-900/30 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                              <FaEdit />
                              <span className="text-xs font-semibold">Editing message</span>
                            </div>
                            <textarea
                              ref={editTextareaRef}
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              className="w-full bg-gray-800 text-white border-2 border-purple-500/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] resize-none"
                              placeholder="Type your message..."
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                <IoClose /> Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(msg.id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                <FaCheck /> Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3">
                            {/* Reply Preview */}
                            {msg.replyTo && (
                              <div className={`mb-2 pl-3 py-2 border-l-2 rounded text-xs opacity-80 ${
                                isMyMessage ? 'border-purple-300 bg-black/20' : 'border-gray-500 bg-black/20'
                              }`}>
                                <div className="font-semibold mb-1">
                                  <FaReply className="inline mr-1" />
                                  Replying to {msg.replyTo.senderName}
                                </div>
                                <div className="truncate">{msg.replyTo.content}</div>
                              </div>
                            )}

                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {msg.attachments.map((file, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 rounded-lg text-sm ${
                                      isMyMessage ? 'bg-purple-800/40' : 'bg-gray-600/40'
                                    }`}
                                  >
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline flex items-center gap-2 group"
                                    >
                                      <span className="text-lg">{getFileIcon(file.name)}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="truncate font-medium group-hover:text-purple-300 transition-colors">
                                          {file.name}
                                        </div>
                                        <div className="text-xs opacity-70">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </div>
                                      </div>
                                      <IoAttach className="text-lg opacity-50" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-1 mt-2 text-xs ${isMyMessage
                                ? "justify-end text-purple-200"
                                : "text-gray-400"
                                }`}
                            >
                              <span>{formatTimestamp(msg.createdAt)}</span>
                              {msg.isEdited && (
                                <span className="italic">(edited)</span>
                              )}
                              {isMyMessage && !msg.id && msg.sending && (
                                <span className="italic text-purple-300 ml-1">Sending...</span>
                              )}
                              {isMyMessage && msg.id && (
                                <IoCheckmarkDone className="text-sm" />
                              )}
                            </div>

                            {msg.replyCount > 0 && (
                              <div className="text-xs opacity-70 mt-1">
                                {msg.replyCount}{" "}
                                {msg.replyCount === 1 ? "reply" : "replies"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
              {selectedProjectId ? (
                <>
                  <FaComments className="text-6xl mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold text-gray-400">
                    No messages yet
                  </h3>
                  <p>Start the conversation by sending a message below.</p>
                </>
              ) : (
                <>
                  <FaProjectDiagram className="text-6xl mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold text-gray-400">
                    Select a Project
                  </h3>
                  <p>Choose a project from the sidebar to view the chat.</p>
                </>
              )}
            </div>
          )}
        </div>

        {selectedProjectId && (
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-700 flex-shrink-0 bg-gray-800"
          >
            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 pt-3 pb-2 bg-gray-700/50 border-b border-gray-600">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
                      <FaReply />
                      <span>Replying to {replyingTo.senderName}</span>
                    </div>
                    <p className="text-sm text-gray-300 truncate pl-5">
                      {replyingTo.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Multiple Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="px-4 pt-3 pb-2 space-y-2 bg-gray-700/30 border-b border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-semibold">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm group hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-lg">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-gray-200">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoClose size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="p-4">
              <div className="flex items-center md:gap-2 gap-0.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={`p-2 hover:bg-gray-700 rounded-full transition-colors ${
                    selectedFiles.length > 0 ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Attach files"
                  disabled={sendingMessage}
                  title="Attach files"
                >
                  <IoAttach size={22} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={replyingTo ? "Type your reply..." : "Type your message..."}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  disabled={sendingMessage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  className="p-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-purple-500/50"
                  aria-label="Send message"
                  disabled={(!message.trim() && selectedFiles.length === 0) || sendingMessage}
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <IoSend size={20} />
                  )}
                </button>
              </div>
              {(message.trim() || selectedFiles.length > 0) && (
                <div className="text-xs text-gray-500 mt-2 px-2">
                  Press Enter to send • Shift + Enter for new line
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;