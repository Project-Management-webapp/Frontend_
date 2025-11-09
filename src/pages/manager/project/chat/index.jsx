import React, { useEffect, useState } from "react";
import ProjectSidebar from "./ProjectSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatLogic } from "./useChatLogic";
import { getFileIcon, formatTimestamp } from "./utils.jsx";
import Toaster from "../../../../components/Toaster";
import VideoCall from "../../../../components/VideoCall/VideoCall";
import IncomingCallNotification from "../../../../components/VideoCall/IncomingCallNotification";
import { useSocket } from "../../../../context/SocketContext";

const Chat = () => {
  const { socket } = useSocket();
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  
  const {
    message,
    setMessage,
    handleMessageInputChange,
    selectedFiles,
    setSelectedFiles,
    fileInputRef,
    messageInputRef,
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
  } = useChatLogic();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const currentUserName = localStorage.getItem('userName') || 'Manager';

  // Handle incoming video call
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      console.log('Incoming video call:', data);
      // Only show notification if not already in a call
      if (!isInVideoCall) {
        setIncomingCall(data);
      }
    };

    socket.on('incoming_video_call', handleIncomingCall);

    return () => {
      socket.off('incoming_video_call', handleIncomingCall);
    };
  }, [socket, isInVideoCall]);

  const handleStartVideoCall = () => {
    if (!selectedProjectId || !selectedProject) return;

    // Emit event to notify other participants
    socket?.emit('start_video_call', {
      projectId: selectedProjectId,
      callerId: currentUserId,
      callerName: currentUserName,
      projectName: selectedProject.projectName
    });

    setIsInVideoCall(true);
  };

  const handleAcceptCall = () => {
    setIncomingCall(null);
    setIsInVideoCall(true);
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  const handleCloseVideoCall = () => {
    setIsInVideoCall(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Incoming Call Notification */}
      {incomingCall && !isInVideoCall && (
        <IncomingCallNotification
          callerName={incomingCall.callerName}
          projectName={incomingCall.projectName}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}

      {/* Video Call Component */}
      {isInVideoCall && selectedProject && (
        <VideoCall
          projectId={selectedProjectId}
          projectName={selectedProject.projectName}
          onClose={handleCloseVideoCall}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          showToast={(message, type) => setToast({ show: true, message, type })}
        />
      )}
      
      <ProjectSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        projects={projects}
        selectedProjectId={selectedProjectId}
        handleSelectProject={handleSelectProject}
        loading={loading}
        error={error}
        fetchAssignedProjects={fetchAssignedProjects}
        projectsWithMentions={projectsWithMentions}
      />

      <div className="flex-1 flex flex-col h-full w-full md:w-2/3 lg:w-3/4">
        <ChatHeader
          selectedProject={selectedProject}
          selectedProjectDetails={selectedProjectDetails}
          setIsSidebarOpen={setIsSidebarOpen}
          onStartVideoCall={handleStartVideoCall}
        />

        <MessageList
          messageListRef={messageListRef}
          loading={loading}
          currentMessages={currentMessages}
          selectedProjectId={selectedProjectId}
          currentUserId={currentUserId}
          editingMessageId={editingMessageId}
          editingContent={editingContent}
          setEditingContent={setEditingContent}
          editTextareaRef={editTextareaRef}
          handleCancelEdit={handleCancelEdit}
          handleSaveEdit={handleSaveEdit}
          showOptionsForMessage={showOptionsForMessage}
          setShowOptionsForMessage={setShowOptionsForMessage}
          handleReplyMessage={handleReplyMessage}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
          formatTimestamp={formatTimestamp}
          getFileIcon={getFileIcon}
        />

        <MessageInput
          selectedProjectId={selectedProjectId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          fileInputRef={fileInputRef}
          messageInputRef={messageInputRef}
          message={message}
          setMessage={setMessage}
          handleMessageInputChange={handleMessageInputChange}
          handleSendMessage={handleSendMessage}
          sendingMessage={sendingMessage}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          getFileIcon={getFileIcon}
          typingUsers={typingUsers}
          isConnected={isConnected}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
};

export default Chat;
