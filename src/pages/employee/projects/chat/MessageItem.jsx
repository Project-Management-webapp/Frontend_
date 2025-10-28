import React from "react";
import {
  IoCheckmarkDone,
  IoClose,
  IoAttach,
} from "react-icons/io5";
import {
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaReply,
  FaCheck,
} from "react-icons/fa";

const MessageItem = ({
  msg,
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
  const isMyMessage = currentUserId && msg.senderId === currentUserId;
  const isEditing = editingMessageId === msg.id;

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`flex flex-col max-w-[75%] sm:max-w-xl ${
          isMyMessage ? "items-end" : "items-start"
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
                <span className="ml-1 font-normal">({msg.position})</span>
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
            className={`relative flex-1 rounded-lg text-sm md:text-base break-words shadow-lg ${
              isMyMessage
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
                  onChange={(e) => setEditingContent(e.target.value)}
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
                {/* Reply Preview - WhatsApp Style - Shows who replied to whose message */}
                {msg.replyTo && (
                  <div
                    className={`mb-3 pl-3 py-2.5 border-l-4 rounded-md text-xs ${
                      isMyMessage
                        ? "border-purple-400 bg-purple-900/40"
                        : "border-green-500 bg-green-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FaReply className={`text-xs ${isMyMessage ? "text-purple-300" : "text-green-400"}`} />
                      <span className={`font-semibold text-xs ${isMyMessage ? "text-purple-200" : "text-green-400"}`}>
                        {/* Show who is replying to whom */}
                        {msg.replyTo.senderName}
                      </span>
                    </div>
                    <div className="text-gray-300 text-xs leading-snug line-clamp-2 pl-5 italic opacity-90">
                      {msg.replyTo.content}
                    </div>
                  </div>
                )}

                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.attachments.map((file, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          isMyMessage
                            ? "bg-purple-800/40"
                            : "bg-gray-600/40"
                        }`}
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-2 group"
                        >
                          <span className="text-lg">
                            {getFileIcon(file.name)}
                          </span>
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
                  className={`flex items-center gap-1.5 mt-2 text-xs ${
                    isMyMessage
                      ? "justify-end text-purple-200"
                      : "text-gray-400"
                  }`}
                >
                  <span>{formatTimestamp(msg.createdAt)}</span>
                  {msg.isEdited && <span className="italic ml-1">(edited)</span>}
                  {isMyMessage && !msg.id && msg.sending && (
                    <span className="italic text-purple-300 ml-1">
                      Sending...
                    </span>
                  )}
                  {isMyMessage && msg.id && <IoCheckmarkDone className="text-sm ml-0.5" />}
                </div>

                {/* Reply count indicator - Shows who replied to this message */}
                {msg.hasReplies && msg.replyCount > 0 && (
                  <div className={`mt-2 pt-2 border-t ${
                    isMyMessage ? "border-purple-500/30" : "border-gray-600/30"
                  }`}>
                    <div className={`text-xs flex items-center gap-1.5 ${
                      isMyMessage ? "justify-end text-purple-300" : "text-green-400"
                    }`}>
                      <FaReply className="text-xs" />
                      <span className="font-medium">
                        {msg.replyCount} {msg.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
