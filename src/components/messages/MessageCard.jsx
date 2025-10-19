import React from "react";
import { formatDistanceToNow } from "date-fns";

const MessageCard = ({ message, currentUserId, onReply, onDelete }) => {
  const isOwnMessage = message.userId === currentUserId;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {message.User?.firstName?.[0]}{message.User?.lastName?.[0]}
            </div>
            <span className="text-sm text-gray-400">
              {message.User?.firstName} {message.User?.lastName}
            </span>
          </div>
        )}

        <div
          className={`rounded-lg p-3 ${
            isOwnMessage
              ? "bg-purple-500 text-white rounded-br-none"
              : "bg-white/10 text-white rounded-bl-none"
          }`}
        >
          {message.replyTo && (
            <div className="mb-2 p-2 bg-black/20 rounded-md border-l-2 border-purple-400">
              <p className="text-xs text-gray-300 mb-1">
                Replying to {message.ReplyTo?.User?.firstName}
              </p>
              <p className="text-sm text-gray-200">{message.ReplyTo?.message?.substring(0, 100)}...</p>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>

          {(message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0) && (
            <div className="mt-2 space-y-1">
              {(message.attachments || []).map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs underline flex items-center gap-1 ${
                    isOwnMessage ? "text-white/80 hover:text-white" : "text-purple-400 hover:text-purple-300"
                  }`}
                >
                  📎 Attachment {index + 1}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <span className={`text-xs ${isOwnMessage ? "text-white/70" : "text-gray-400"}`}>
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onReply(message)}
                className={`text-xs ${
                  isOwnMessage ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-purple-400"
                } transition-colors`}
              >
                Reply
              </button>
              {isOwnMessage && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
