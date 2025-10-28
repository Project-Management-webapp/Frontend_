import React from "react";
import { FaComments, FaProjectDiagram } from "react-icons/fa";
import MessageItem from "./MessageItem";

const MessageSkeleton = ({ isRight }) => (
  <div
    className={`flex flex-col ${
      isRight ? "items-end" : "items-start"
    } animate-pulse`}
  >
    <div className="flex items-center gap-2 mb-1 px-1">
      {!isRight && <div className="w-6 h-6 bg-gray-700 rounded-full"></div>}
      <div className="h-3 bg-gray-700 rounded w-20"></div>
    </div>
    <div
      className={`p-3 rounded-lg w-64 h-16 ${
        isRight
          ? "bg-purple-600/50 rounded-tr-none"
          : "bg-gray-700/50 rounded-tl-none"
      }`}
    ></div>
  </div>
);

const MessageList = ({
  messageListRef,
  loading,
  currentMessages,
  selectedProjectId,
  currentUserId,
  editingMessageId,
  editingContent,
  setEditingContent,
  editTextareaRef,
  handleCancelEdit,
  handleSaveEdit,
  showOptionsForMessage,
  setShowOptionsForMessage,
  handleReplyMessage,
  handleEditMessage,
  handleDeleteMessage,
  formatTimestamp,
  getFileIcon,
}) => {
  return (
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
        currentMessages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
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
        ))
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
  );
};

export default MessageList;
