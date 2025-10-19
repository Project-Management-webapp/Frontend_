import React, { useState, useRef, useEffect } from 'react'; // Import useEffect
import { IoSend, IoAttach, IoClose } from 'react-icons/io5';

const ChatModal = ({ isOpen, onClose, assignmentId }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // --- 1. Create a ref for the message list container ---
  const messageListRef = useRef(null);

  // --- 2. Update messages state to include senderName ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'manager', senderName: 'Satish (Manager)', text: 'Hey, how is the project going?' },
    { id: 2, sender: 'me', senderName: 'Me', text: 'Going well! I should have an update by EOD.' },
  ]);

  if (!isOpen) return null;

  // --- 3. Add useEffect to scroll to bottom when messages change ---
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); // Dependency array ensures this runs when 'messages' updates

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message && !selectedFile) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      senderName: 'Me', // Add senderName to new messages
      text: message,
      file: selectedFile ? selectedFile.name : null,
    };
    
    console.log('Sending message:', newMessage);
    // In a real app: await sendChatMessage(assignmentId, message, selectedFile);
    
    setMessages([...messages, newMessage]);
    setMessage('');
    setSelectedFile(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-lg border border-white/20 h-[700px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-center">Chat with Manager</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute cursor-pointer top-5 right-5 text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Message List */}
        <div 
          ref={messageListRef} // --- 4. Attach the ref here ---
          className="flex-grow p-4 space-y-4 overflow-y-auto"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              {/* --- 5. Add Sender Name --- */}
              <span className="text-xs text-gray-400 mb-1 px-1">
                {msg.senderName}
              </span>
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === 'me'
                    ? 'bg-purple-600 text-white rounded-tr-none' // Style for 'me'
                    : 'bg-gray-700 text-gray-200 rounded-tl-none' // Style for 'other'
                }`}
              >
                <p>{msg.text}</p>
                {msg.file && (
                  <div className="mt-2 p-2 bg-black/20 rounded-md text-sm">
                    <strong>File:</strong> {msg.file}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex-shrink-0">
          {selectedFile && (
            <div className="mb-2 px-3 py-2 bg-gray-700 rounded-md text-sm flex justify-between items-center">
              <span>{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                <IoClose />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            >
              <IoAttach size={22} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
            >
              <IoSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;