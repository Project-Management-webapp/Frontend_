import React, { useState } from "react";
import {
  IoCheckmarkDone,
  IoCheckmark,
  IoClose,
  IoAttach,
  IoTime,
} from "react-icons/io5";
import {
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaReply,
  FaCheck,
  FaExpand,
  FaCopy,
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
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyMessage = () => {
    if (msg.content) {
      navigator.clipboard.writeText(msg.content).then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
        setShowOptionsForMessage(null);
      }).catch(err => {
        console.error('Failed to copy message:', err);
      });
    }
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  // Highlight @mentions in message content - WhatsApp style
  const renderContentWithMentions = (content) => {
    if (!content) return null;
    
    // Match @username or @email patterns
    const mentionRegex = /@([A-Za-z0-9._-]+(?:@[A-Za-z0-9.-]+\.[A-Za-z]{2,})?|\w+(?:\s+\w+)*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before mention (normal text)
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${keyIndex++}`} className="font-normal">
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add highlighted mention - only the @name part, bold and highlighted like WhatsApp
      parts.push(
        <span
          key={`mention-${keyIndex++}`}
          className={`font-bold ${
            isMyMessage 
              ? "text-green-400 bg-purple-700/40" 
              : "text-green-400 bg-blue-900/20"
          } px-0.5 rounded`}
        >
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text (normal text)
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${keyIndex++}`} className="font-normal">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="font-normal">{content}</span>;
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-1.5 animate-fadeIn`}>
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-2xl ${
          isMyMessage ? "items-end" : "items-start"
        }`}
      >
        {!isMyMessage && (
          <div className="flex items-center gap-2 mb-1 px-1">
            {msg.senderImage ? (
              <img
                src={msg.senderImage}
                alt={msg.senderName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-700"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-gray-700">
                {msg.senderName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[11px] text-gray-300 font-semibold">
              {msg.senderName}
              {msg.position && (
                <span className="ml-1 font-normal text-gray-400 text-[10px]">• {msg.position}</span>
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
                    onClick={handleCopyMessage}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-purple-400"
                  >
                    <FaCopy /> {showCopied ? 'Copied!' : 'Copy'}
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
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-green-400 rounded-t-lg"
                  >
                    <FaReply /> Reply
                  </button>
                  <button
                    onClick={handleCopyMessage}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-purple-400 rounded-b-lg"
                  >
                    <FaCopy /> {showCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div
            className={`relative flex-1 rounded-2xl text-sm md:text-base break-words shadow-lg hover:shadow-xl transition-all duration-200 ${
              isMyMessage
                ? "bg-gradient-to-br from-purple-600 via-purple-600 to-purple-700 text-white rounded-tr-sm"
                : "bg-gradient-to-br from-gray-700 via-gray-750 to-gray-800 text-gray-100 rounded-tl-sm border border-gray-600/30"
            }`}
          >
            {isEditing ? (
              <div className="p-4 space-y-3 bg-gray-900/40 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <FaEdit />
                  <span className="text-xs font-semibold">Editing message</span>
                </div>
                <textarea
                  ref={editTextareaRef}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full bg-gray-800 text-white border-2 border-purple-500/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] resize-none"
                  placeholder="Type your message..."
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <IoClose /> Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(msg.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FaCheck /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className={msg.content ? "p-2 md:p-2.5" : "p-0"}>
                {/* Reply Preview - WhatsApp Style - Shows original message being replied to */}
                {msg.replyTo && (
                  <div
                    className={`mb-2 pl-2 py-1.5 border-l-[3px] rounded-r-md text-xs ${
                      isMyMessage
                        ? "border-purple-300 bg-purple-900/20"
                        : "border-green-400 bg-green-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <FaReply className={`text-[10px] ${isMyMessage ? "text-purple-300" : "text-green-400"}`} />
                      <span className={`font-semibold text-[11px] ${isMyMessage ? "text-purple-200" : "text-green-300"}`}>
                        {msg.replyTo.senderId === currentUserId ? "You" : msg.replyTo.senderName}
                      </span>
                    </div>
                    <div className={`text-[11px] leading-snug line-clamp-2 pl-3.5 ${
                      isMyMessage ? "text-purple-100/80" : "text-gray-200/80"
                    }`}>
                      {msg.replyTo.content || "(File attachment)"}
                    </div>
                  </div>
                )}

                {msg.content && (
                  <p className="whitespace-pre-wrap leading-[1.4] text-[14px] mb-0">
                    {renderContentWithMentions(msg.content)}
                  </p>
                )}

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`${msg.content ? 'mt-1.5' : ''}`}>
                    {(() => {
                      const images = msg.attachments.filter(file => 
                        file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
                      );
                      const files = msg.attachments.filter(file => 
                        !file.type?.startsWith('image/') && !/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
                      );

                      return (
                        <>
                          {/* Image Gallery - No padding, edge to edge */}
                          {images.length > 0 && (
                            <div className={`grid gap-0.5 ${
                              images.length === 1 ? 'grid-cols-1' :
                              images.length === 2 ? 'grid-cols-2' :
                              images.length === 3 ? 'grid-cols-3' :
                              'grid-cols-2'
                            } ${images.length === 1 ? 'rounded-xl overflow-hidden' : 'rounded-lg overflow-hidden'}`}>
                              {images.map((file, index) => (
                                <div key={`img-${index}`} className="relative group overflow-hidden">
                                  <div
                                    onClick={() => loadedImages[index] && setLightboxImage(file.url)}
                                    className={`cursor-pointer relative ${loadedImages[index] ? '' : 'bg-gray-700/50 animate-pulse'}`}
                                  >
                                    {/* Skeleton/Blur loader */}
                                    {!loadedImages[index] && (
                                      <div className={`absolute inset-0 flex items-center justify-center ${
                                        images.length === 1 ? 'h-[400px]' : 'h-32'
                                      }`}>
                                        <div className="flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                          <span className="text-xs text-gray-400">Loading...</span>
                                        </div>
                                      </div>
                                    )}
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className={`w-full transition-all duration-300 ${
                                        images.length === 1 
                                          ? 'max-h-[400px] object-cover' 
                                          : 'h-32 object-cover'
                                      } ${
                                        loadedImages[index] 
                                          ? 'opacity-100 blur-0' 
                                          : 'opacity-0 blur-lg'
                                      }`}
                                      loading="lazy"
                                      onLoad={() => handleImageLoad(index)}
                                    />
                                    {loadedImages[index] && (
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                        <FaExpand className="opacity-0 group-hover:opacity-100 text-white text-lg transition-opacity drop-shadow-lg" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* File Attachments */}
                          {files.length > 0 && (
                            <div className={`space-y-1 ${images.length > 0 ? 'mt-1.5' : ''}`}>
                              {files.map((file, index) => (
                                <div
                                  key={`file-${index}`}
                                  className={`p-2 rounded-md text-sm ${
                                    isMyMessage
                                      ? "bg-purple-800/25"
                                      : "bg-gray-600/25"
                                  }`}
                                >
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-2 group"
                                  >
                                    <span className="text-sm">
                                      {getFileIcon(file.name)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate font-medium group-hover:text-purple-300 transition-colors text-[11px]">
                                        {file.name}
                                      </div>
                                      <div className="text-[10px] opacity-50">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </div>
                                    </div>
                                    <IoAttach className="text-sm opacity-30" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                <div
                  className={`flex items-center gap-1 mt-1 text-[11px] ${
                    isMyMessage
                      ? "justify-end text-purple-200/70"
                      : "text-gray-400/80"
                  }`}
                >
                  <span>{formatTimestamp(msg.createdAt)}</span>
                  {msg.isEdited && <span className="italic ml-1">(edited)</span>}
                  
                  {/* Message Status Indicators - WhatsApp Style */}
                  {isMyMessage && (
                    <span className="ml-1 flex items-center">
                      {msg.sending || !msg.id ? (
                        // Clock icon while sending
                        <IoTime className="text-sm text-purple-300 animate-pulse" title="Sending..." />
                      ) : (
                        // Double tick when delivered (since we don't have read receipts yet)
                        <IoCheckmarkDone className="text-sm text-gray-300" title="Delivered" />
                      )}
                    </span>
                  )}
                </div>

                {/* Reply count indicator - Shows who replied to this message */}
                {msg.hasReplies && msg.replyCount > 0 && (
                  <div className={`mt-1 pt-1 border-t ${
                    isMyMessage ? "border-purple-500/15" : "border-gray-600/15"
                  }`}>
                    <div className={`text-[11px] flex items-center gap-1 ${
                      isMyMessage ? "justify-end text-purple-300/70" : "text-green-400/70"
                    }`}>
                      <FaReply className="text-[10px]" />
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

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <IoClose size={32} />
          </button>
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={lightboxImage}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <IoAttach />
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
