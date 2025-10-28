import React from "react";
import { IoSend, IoAttach, IoClose } from "react-icons/io5";
import { FaReply } from "react-icons/fa";

const MessageInput = ({
  selectedProjectId,
  replyingTo,
  setReplyingTo,
  selectedFiles,
  setSelectedFiles,
  fileInputRef,
  message,
  setMessage,
  handleSendMessage,
  sendingMessage,
  handleFileChange,
  removeFile,
  getFileIcon,
}) => {
  if (!selectedProjectId) return null;

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t border-gray-700 flex-shrink-0 bg-gray-800"
    >
      {/* Reply Preview with WhatsApp-style indicator */}
      {replyingTo && (
        <div className="px-4 pt-3 pb-2 bg-gradient-to-r from-green-900/20 to-gray-700/30 border-b border-green-500/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 border-l-4 border-green-500 pl-3">
              <div className="flex items-center gap-2 text-xs text-green-400 font-semibold mb-1">
                <FaReply />
                <span>Replying to {replyingTo.senderName}</span>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2">
                {replyingTo.content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Cancel reply"
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
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
              attached
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
              selectedFiles.length > 0
                ? "text-purple-400"
                : "text-gray-400 hover:text-white"
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
            placeholder={
              replyingTo ? "Type your reply..." : "Type your message..."
            }
            className="flex-1 bg-gray-900 border border-gray-700 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            disabled={sendingMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            className="p-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-purple-500/50"
            aria-label="Send message"
            disabled={
              (!message.trim() && selectedFiles.length === 0) || sendingMessage
            }
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
  );
};

export default MessageInput;
