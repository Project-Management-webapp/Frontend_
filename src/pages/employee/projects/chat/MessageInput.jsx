import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoAttach, IoClose } from "react-icons/io5";
import { FaReply } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  selectedProjectId,
  replyingTo,
  setReplyingTo,
  selectedFiles,
  setSelectedFiles,
  fileInputRef,
  message,
  setMessage,
  handleMessageInputChange,
  handleSendMessage,
  sendingMessage,
  handleFileChange,
  removeFile,
  getFileIcon,
  typingUsers = [],
  isConnected = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const newMessage = message + emoji;
    
    // Use the handler if available, otherwise set directly
    if (handleMessageInputChange) {
      handleMessageInputChange(newMessage);
    } else {
      setMessage(newMessage);
    }
  };

  if (!selectedProjectId) return null;

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t border-gray-700/50 flex-shrink-0 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const isImage = file.type?.startsWith('image/');
              
              if (isImage) {
                return (
                  <div
                    key={index}
                    className="relative group bg-gray-700 rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="text-xs text-white truncate">{file.name}</div>
                      <div className="text-xs text-gray-300">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
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
                );
              }
            })}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 md:p-5">
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="mb-2 px-3 text-xs text-gray-400 flex items-center gap-2 animate-pulse">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...`
                : typingUsers.length === 2
                ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`
              }
            </span>
          </div>
        )}

        <div className="flex items-center md:gap-3 gap-1.5 bg-gray-900/50 rounded-full p-1.5 border border-gray-700/50 focus-within:border-purple-500/50 transition-all relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 hover:bg-gray-700/70 rounded-full transition-all duration-200 ${
                showEmojiPicker
                  ? "text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="Emoji picker"
              title="Add emoji"
            >
              <BsEmojiSmile size={22} />
            </button>
            
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  width={350}
                  height={400}
                  searchPlaceHolder="Search emoji..."
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className={`p-2 hover:bg-gray-700/70 rounded-full transition-all duration-200 ${
              selectedFiles.length > 0
                ? "text-purple-400 bg-purple-500/10"
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
            onChange={(e) => handleMessageInputChange ? handleMessageInputChange(e.target.value) : setMessage(e.target.value)}
            placeholder={
              replyingTo ? "Type your reply..." : "Type your message..."
            }
            className="flex-1 bg-transparent border-none py-2 px-2 focus:outline-none text-white placeholder-gray-500 transition-all"
            disabled={sendingMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="flex items-center gap-2">
            {/* Connection Status Indicator */}
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></div>
            
            <button
              type="submit"
              className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
              aria-label="Send message"
              disabled={
                (!message.trim() && selectedFiles.length === 0) || sendingMessage
              }
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
        {(message.trim() || selectedFiles.length > 0) && (
          <div className="text-xs text-gray-500 mt-2.5 px-3 flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-400">Enter</kbd> to send</span>
            <span className="text-gray-600">•</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-400">Shift + Enter</kbd> for new line</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
