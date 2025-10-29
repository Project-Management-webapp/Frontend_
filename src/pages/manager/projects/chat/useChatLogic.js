import { useState, useRef, useEffect } from "react";
import {
  sendmessage,
  getmessage,
  updatemessage,
  deletemessage,
  replymessage,
  getProjectsWithMentions,
  markMentionsAsViewed,
} from "../../../../api/manager/chat";
import { getAllProjectAssignments } from "../../../../api/manager/projectAssign";
import { getProjectById } from "../../../../api/manager/project";
import { useSocket } from "../../../../context/SocketContext";

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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [projectsWithMentions, setProjectsWithMentions] = useState([]);
  const typingTimeoutRef = useRef(null);

  const { socket, isConnected, joinProject, leaveProject, emitTyping, emitStopTyping } = useSocket();

  useEffect(() => {
    fetchAssignedProjects();
    try {
      const userIdString = localStorage.getItem("userId");
      if (userIdString) {
        const userIdInt = parseInt(userIdString, 10);
        setCurrentUserId(userIdInt);
      }
      
      // Restore last selected project from localStorage
      const lastSelectedProject = localStorage.getItem("lastSelectedProjectId");
      if (lastSelectedProject) {
        setSelectedProjectId(parseInt(lastSelectedProject, 10));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectMessages(selectedProjectId);
      fetchProjectDetails(selectedProjectId);
      
      // Join socket room for this project
      if (socket && isConnected) {
        joinProject(selectedProjectId);
      }

      // Cleanup: leave room when switching projects
      return () => {
        if (socket && isConnected) {
          leaveProject(selectedProjectId);
        }
      };
    }
  }, [selectedProjectId, socket, isConnected]);

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

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for room join notifications
    socket.on('user_joined_room', ({ socketId, projectId, timestamp }) => {
      console.log('👤 User joined room:', { socketId, projectId, timestamp });
    });

    // Listen for new messages
    socket.on('new_message', ({ message: newMsg, projectId }) => {
      console.log('📨 Received new_message event:', { 
        messageId: newMsg?.id,
        senderId: newMsg?.senderId,
        isReply: !!newMsg.replyToMessageId,
        hasParentMessage: !!newMsg.parentMessage,
        projectId, 
        selectedProjectId, 
        currentUserId,
        projectIdMatch: String(projectId) === String(selectedProjectId)
      });
      
      // Compare as strings to handle type inconsistencies
      if (String(projectId) === String(selectedProjectId)) {
        const formattedMessage = {
          id: newMsg.id,
          content: newMsg.content,
          senderId: newMsg.senderId,
          senderName: newMsg.sender?.fullName || newMsg.sender?.email || "Unknown",
          senderImage: newMsg.sender?.profileImage,
          position: newMsg.sender?.position,
          attachments: newMsg.attachments,
          isEdited: newMsg.isEdited,
          createdAt: newMsg.createdAt,
          replyCount: 0,
          hasReplies: false,
          isReply: !!newMsg.replyToMessageId,
          replyTo: newMsg.parentMessage ? {
            id: newMsg.parentMessage.id,
            content: newMsg.parentMessage.content,
            senderName: newMsg.parentMessage.sender?.fullName || newMsg.parentMessage.sender?.email || "Unknown",
            senderId: newMsg.parentMessage.senderId || newMsg.parentMessage.sender?.id
          } : null,
        };

        console.log('✅ Formatted message:', {
          id: formattedMessage.id,
          isReply: formattedMessage.isReply,
          hasReplyTo: !!formattedMessage.replyTo,
          replyToContent: formattedMessage.replyTo?.content
        });

        // If it's from current user, replace the optimistic message or skip if already exists
        if (newMsg.senderId === currentUserId) {
          setCurrentMessages((prev) => {
            // Check if message with this ID already exists (from API response)
            if (prev.some(msg => msg.id === newMsg.id)) {
              console.log('ℹ️ Message already exists from API response, skipping socket update');
              return prev;
            }
            
            // Find and replace the temporary/optimistic message
            const hasTemp = prev.some(msg => !msg.id || msg.sending);
            if (hasTemp) {
              console.log('🔄 Replacing optimistic message with real message');
              return prev.map(msg => 
                (!msg.id || msg.sending) ? formattedMessage : msg
              );
            }
            
            console.log('ℹ️ No optimistic message found, adding to list');
            return [...prev, formattedMessage];
          });
        } else {
          // Add message from other users
          setCurrentMessages((prev) => {
            // Check if message already exists
            if (prev.some(msg => msg.id === newMsg.id)) {
              console.log('⚠️ Message already exists, skipping');
              return prev;
            }
            console.log('➕ Adding new message from other user');
            return [...prev, formattedMessage];
          });
        }
      }
    });

    // Listen for message updates
    socket.on('message_updated', ({ message: updatedMsg, projectId }) => {
      if (String(projectId) === String(selectedProjectId)) {
        setCurrentMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMsg.id
              ? {
                  ...msg,
                  content: updatedMsg.content,
                  isEdited: updatedMsg.isEdited,
                }
              : msg
          )
        );
      }
    });

    // Listen for message deletions
    socket.on('message_deleted', ({ messageId, projectId }) => {
      if (String(projectId) === String(selectedProjectId)) {
        setCurrentMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    });

    // Listen for typing indicators
    socket.on('user_typing', ({ userName }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(userName)) {
          return [...prev, userName];
        }
        return prev;
      });
    });

    socket.on('user_stop_typing', () => {
      setTypingUsers([]);
    });

    return () => {
      socket.off('user_joined_room');
      socket.off('new_message');
      socket.off('message_updated');
      socket.off('message_deleted');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, selectedProjectId, currentUserId]);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProjectAssignments();

      if (response.success && response.data && response.data.projects) {
        // Manager can see all projects
        const allProjects = response.data.projects.rows;

        const formattedProjects = allProjects.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
        }));

        setProjects(formattedProjects);
        
        // Check if we have a saved project selection
        const lastSelectedProject = localStorage.getItem("lastSelectedProjectId");
        
        if (lastSelectedProject) {
          const lastProjectId = parseInt(lastSelectedProject, 10);
          // Check if the saved project still exists in the list
          const projectExists = formattedProjects.some(p => p.id === lastProjectId);
          
          if (projectExists && !selectedProjectId) {
            setSelectedProjectId(lastProjectId);
          } else if (!projectExists) {
            // If saved project no longer exists, clear it and select first
            localStorage.removeItem("lastSelectedProjectId");
            if (formattedProjects.length > 0 && !selectedProjectId) {
              setSelectedProjectId(formattedProjects[0].id);
              localStorage.setItem("lastSelectedProjectId", formattedProjects[0].id);
            }
          }
        } else if (formattedProjects.length > 0 && !selectedProjectId) {
          // No saved project, select first one
          setSelectedProjectId(formattedProjects[0].id);
          localStorage.setItem("lastSelectedProjectId", formattedProjects[0].id);
        }
      } else {
        setError("Failed to load projects. Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch projects"
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

  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await getProjectById(projectId);
      console.log("Project details response:", response);
      if (response.success && response.data) {
        setSelectedProjectDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching project details:", error.message || "Failed to fetch project details");
    }
  };

  const fetchProjectsWithMentionsData = async () => {
    try {
      const response = await getProjectsWithMentions();
      if (response.success && response.data) {
        setProjectsWithMentions(response.data);
      }
    } catch (error) {
      console.error("Error fetching mentions:", error);
    }
  };

  // Fetch mentions on mount and when projects change
  useEffect(() => {
    if (projects.length > 0) {
      fetchProjectsWithMentionsData();
    }
  }, [projects.length]);

  // Listen for real-time mention notifications
  useEffect(() => {
    const handleNewMention = (event) => {
      const { projectId } = event.detail;
      console.log('🔔 Received new mention notification for project:', projectId);
      
      // Add this project to mentions list if not already there
      setProjectsWithMentions(prev => {
        if (!prev.includes(parseInt(projectId))) {
          return [...prev, parseInt(projectId)];
        }
        return prev;
      });
    };

    window.addEventListener('newMention', handleNewMention);
    return () => window.removeEventListener('newMention', handleNewMention);
  }, []);

  // Mark mentions as viewed when opening a project
  const handleMarkMentionsViewed = async (projectId) => {
    try {
      await markMentionsAsViewed(projectId);
      // Remove this project from mentions list
      setProjectsWithMentions(prev => prev.filter(id => id !== projectId));
    } catch (error) {
      console.error("Error marking mentions as viewed:", error);
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

      if (filesToSend.length > 0) {
        filesToSend.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      let response;
      
      // Use different endpoints for reply vs regular message
      if (replyToMessage) {
        response = await replymessage(formData, replyToMessage.id);
      } else {
        response = await sendmessage(formData);
      }

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
        const errorMsg = response.message || "Failed to send message";
        console.error("Failed to send message:", errorMsg);
        setToast({ show: true, message: errorMsg, type: "error" });
        setMessage(messageToSend);
        setSelectedFiles(filesToSend);
        setReplyingTo(replyToMessage);
      }
    } catch (error) {
      setCurrentMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
      const errorMsg = error.message || "Failed to send message";
      console.error("Error sending message:", errorMsg);
      setToast({ show: true, message: errorMsg, type: "error" });
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
    
    // Save selected project to localStorage for persistence
    localStorage.setItem("lastSelectedProjectId", projectId);
    
    // Mark mentions as viewed when opening a project
    if (projectsWithMentions.includes(projectId)) {
      handleMarkMentionsViewed(projectId);
    }
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
      setToast({ show: true, message: "Message cannot be empty", type: "error" });
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
        const errorMsg = response.message || "Failed to update message";
        console.error("Failed to update message:", errorMsg);
        setToast({ show: true, message: errorMsg, type: "error" });
      } else {
        setToast({ show: true, message: "Message updated successfully", type: "success" });
      }
    } catch (error) {
      setCurrentMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? originalMessage : msg
        )
      );
      const errorMsg = error.message || "Failed to update message";
      console.error("Error updating message:", errorMsg);
      setToast({ show: true, message: errorMsg, type: "error" });
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
        const errorMsg = response.message || "Failed to delete message";
        console.error("Failed to delete message:", errorMsg);
        setToast({ show: true, message: errorMsg, type: "error" });
      } else {
        setToast({ show: true, message: "Message deleted successfully", type: "success" });
      }
    } catch (error) {
      setCurrentMessages(originalMessages);
      const errorMsg = error.message || "Failed to delete message";
      console.error("Error deleting message:", errorMsg);
      setToast({ show: true, message: errorMsg, type: "error" });
    }
  };

  const handleMessageInputChange = (value) => {
    setMessage(value);

    // Handle typing indicator
    if (socket && selectedProjectId) {
      const userFullName = localStorage.getItem('fullName') || 'Someone';
      
      // Emit typing event
      emitTyping(selectedProjectId, userFullName);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(selectedProjectId);
      }, 2000);
    }
  };

  // Extract team members for @mentions
  const teamMembers = [];
  if (selectedProjectDetails) {
    // Add creator/manager
    if (selectedProjectDetails.creator) {
      teamMembers.push({
        id: selectedProjectDetails.creator.id,
        name: selectedProjectDetails.creator.fullName || selectedProjectDetails.creator.email,
        email: selectedProjectDetails.creator.email,
        image: selectedProjectDetails.creator.profileImage,
        role: "Manager"
      });
    }
    // Add employees from assignments
    if (selectedProjectDetails.assignments) {
      selectedProjectDetails.assignments.forEach(assignment => {
        if (assignment.employee && !teamMembers.find(m => m.id === assignment.employee.id)) {
          teamMembers.push({
            id: assignment.employee.id,
            name: assignment.employee.fullName || assignment.employee.email,
            email: assignment.employee.email,
            image: assignment.employee.profileImage,
            role: assignment.role || "Employee"
          });
        }
      });
    }
  }

  return {
    message,
    setMessage,
    handleMessageInputChange,
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
    toast,
    setToast,
    selectedProjectDetails,
    teamMembers,
    projectsWithMentions,
    typingUsers,
    isConnected,
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
