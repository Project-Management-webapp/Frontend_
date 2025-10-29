import React from "react";
import { FaComments, FaProjectDiagram } from "react-icons/fa";
import MessageItem from "./MessageItem";

// Date Divider Component - WhatsApp Style
const DateDivider = ({ date }) => (
  <div className="flex items-center justify-center my-4">
    <div className="bg-gray-800/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-lg text-xs font-medium shadow-lg border border-gray-700/50">
      {date}
    </div>
  </div>
);

// Helper function to format date labels
const getDateLabel = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time parts for accurate date comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    // Format as "January 15, 2024" or "15/01/2024" based on preference
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return messageDate.toLocaleDateString('en-US', options);
  }
};

// Helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

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
      className="flex-grow p-4 md:p-6 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%), 
                         radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)`
      }}
    >
      {loading ? (
        <div className="space-y-4">
          <MessageSkeleton isRight={false} />
          <MessageSkeleton isRight={true} />
          <MessageSkeleton isRight={false} />
        </div>
      ) : currentMessages.length > 0 ? (
        currentMessages.map((msg, index) => {
          // Check if we need to show a date divider
          const showDateDivider = index === 0 || !isSameDay(
            currentMessages[index - 1].createdAt,
            msg.createdAt
          );

          return (
            <React.Fragment key={msg.id || `temp-${index}`}>
              {showDateDivider && (
                <DateDivider date={getDateLabel(msg.createdAt)} />
              )}
              <MessageItem
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
            </React.Fragment>
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
  );
};

export default MessageList;
