import React, { useEffect } from "react";
import ProjectSidebar from "./ProjectSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatLogic } from "./useChatLogic";
import { getFileIcon, formatTimestamp } from "./utils.jsx";
import Toaster from "../../../../components/Toaster";

const Chat = () => {
  const {
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
  } = useChatLogic();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
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
