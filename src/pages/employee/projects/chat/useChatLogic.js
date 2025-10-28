import { useState, useRef, useEffect } from "react";
import {
  sendmessage,
  getmessage,
  updatemessage,
  deletemessage,
} from "../../../../api/employee/chat";
import { getOngoingProjects } from "../../../../api/employee/assignProject";

export const useChatLogic = () => {
  const [message, setMessage] = useState("");
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
      setError(null);
      const response = await getOngoingProjects();

      if (response.success && response.projects) {
        const acceptedProjects = response.projects.filter(
          (assignment) => assignment.workStatus === "in_progress"
        );

        const formattedProjects = acceptedProjects.map((assignment) => ({
          id: assignment.project.id,
          name: assignment.project.name,
          description: assignment.project.description,
          assignmentId: assignment.id,
        }));

        setProjects(formattedProjects);
        if (formattedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(formattedProjects[0].id);
        }
      } else {
        setError("Failed to load projects. Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch assigned projects"
      );
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
          senderName: msg.sender?.fullName || msg.sender?.email || "Unknown",
          senderImage: msg.sender?.profileImage,
          position: msg.sender?.position,
          attachments: msg.attachments,
          isEdited: msg.isEdited,
          createdAt: msg.createdAt,
          replyCount: msg.replies?.length || 0,
          hasReplies: msg.replies && msg.replies.length > 0,
          isReply: !!msg.replyToMessageId,
          replyTo: msg.parentMessage ? {
            id: msg.parentMessage.id,
            content: msg.parentMessage.content,
            senderName: msg.parentMessage.sender?.fullName || msg.parentMessage.sender?.email || "Unknown",
            senderId: msg.parentMessage.sender?.id || msg.parentMessage.senderId
          } : null,
          replies: msg.replies || []
        }));

        setCurrentMessages(formattedMessages);
      }
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.message || "Failed to fetch messages"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      e.target.value = null;
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      (!message.trim() && selectedFiles.length === 0) ||
      !selectedProjectId
    )
      return;

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
      attachments: filesToSend.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        temp: true,
      })),
      isEdited: false,
      createdAt: new Date().toISOString(),
      replyCount: 0,
      sending: true,
      isReply: !!replyToMessage,
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            content: replyToMessage.content,
            senderName: replyToMessage.senderName,
            senderId: replyToMessage.senderId
          }
        : null,
    };

    setCurrentMessages((prevMessages) => [
      ...prevMessages,
      newMessageOptimistic,
    ]);
    setMessage("");
    setSelectedFiles([]);
    setReplyingTo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      setSendingMessage(true);
      const formData = new FormData();

      if (messageToSend.trim()) {
        formData.append("content", messageToSend);
      }

      formData.append("projectId", selectedProjectId);

      if (replyToMessage) {
        formData.append("replyToMessageId", replyToMessage.id);
      }

      if (filesToSend.length > 0) {
        filesToSend.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const response = await sendmessage(formData);

      if (response.success && response.data) {
        const sentMessage = response.data;
        
        // Handle both regular message and reply message response structures
        const messageData = sentMessage.reply || sentMessage;
        const parentMsg = sentMessage.parentMessage;
        
        const formattedSentMessage = {
          id: messageData.id,
          content: messageData.content,
          senderId: messageData.senderId,
          senderName: messageData.sender?.fullName || messageData.sender?.email || "You",
          senderImage: messageData.sender?.profileImage,
          position: messageData.sender?.position,
          attachments: messageData.attachments,
          isEdited: messageData.isEdited,
          createdAt: messageData.createdAt,
          replyCount: 0,
          hasReplies: false,
          isReply: !!messageData.replyToMessageId,
          replyTo: parentMsg ? {
            id: parentMsg.id,
            content: parentMsg.content,
            senderName: parentMsg.sender?.fullName || parentMsg.sender?.email || "Unknown",
            senderId: parentMsg.sender?.id || parentMsg.senderId
          } : null,
        };
        
        setCurrentMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId ? formattedSentMessage : msg
          )
        );
      } else {
        setCurrentMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempId)
        );
        console.error(
          "Failed to send message:",
          response.message || "Unknown error"
        );
        setMessage(messageToSend);
        setSelectedFiles(filesToSend);
        setReplyingTo(replyToMessage);
      }
    } catch (error) {
      setCurrentMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
      console.error(
        "Error sending message:",
        error.message || "Failed to send message"
      );
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
    const originalMessage = currentMessages.find(
      (msg) => msg.id === messageId
    );

    setCurrentMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: editingContent, isEdited: true }
          : msg
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
        setCurrentMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? originalMessage : msg
          )
        );
        console.error(
          "Failed to update message:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      setCurrentMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? originalMessage : msg
        )
      );
      console.error(
        "Error updating message:",
        error.message || "Failed to update message"
      );
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      setShowOptionsForMessage(null);
      return;
    }

    const originalMessages = [...currentMessages];
    setCurrentMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    setShowOptionsForMessage(null);

    try {
      const response = await deletemessage(messageId);

      if (!response.success) {
        setCurrentMessages(originalMessages);
        console.error(
          "Failed to delete message:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      setCurrentMessages(originalMessages);
      console.error(
        "Error deleting message:",
        error.message || "Failed to delete message"
      );
    }
  };

  return {
    message,
    setMessage,
    selectedFiles,
    setSelectedFiles,
    fileInputRef,
    messageListRef,
    editTextareaRef,
    projects,
    selectedProjectId,
    currentMessages,
    isSidebarOpen,
    setIsSidebarOpen,
    loading,
    sendingMessage,
    currentUserId,
    editingMessageId,
    editingContent,
    setEditingContent,
    showOptionsForMessage,
    setShowOptionsForMessage,
    error,
    replyingTo,
    setReplyingTo,
    fetchAssignedProjects,
    handleFileChange,
    removeFile,
    handleSendMessage,
    handleSelectProject,
    handleEditMessage,
    handleReplyMessage,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteMessage,
  };
};
