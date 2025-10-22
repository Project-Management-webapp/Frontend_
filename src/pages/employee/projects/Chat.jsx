import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoAttach, IoClose } from 'react-icons/io5';
import { FaProjectDiagram, FaBars, FaTimes } from 'react-icons/fa';
import logo from "/login_logo.png"; // <-- Import the logo

// --- Static Data (remains the same) ---
const staticProjects = [
  { id: 1, name: 'Website Redesign', lastMessage: 'Okay, sounds good!' },
  { id: 2, name: 'Mobile App Dev', lastMessage: 'Can you share the file?' },
  { id: 3, name: 'Marketing Campaign', lastMessage: 'Meeting at 3 PM.' },
];

const staticMessages = {
  1: [
    { id: 101, sender: 'manager', senderName: 'Satish (Manager)', text: 'Hey, how is the Website Redesign going?' },
    { id: 102, sender: 'me', senderName: 'Me', text: 'Going well! I should have an update by EOD.' },
    { id: 103, sender: 'manager', senderName: 'Satish (Manager)', text: 'Okay, sounds good!' },
  ],
  2: [
    { id: 201, sender: 'manager', senderName: 'Satish (Manager)', text: 'Any progress on the Mobile App?' },
    { id: 202, sender: 'me', senderName: 'Me', text: 'Yes, fixed the login bug.' },
    { id: 203, sender: 'me', senderName: 'Me', text: 'I\'ll push the code shortly.' },
    { id: 204, sender: 'manager', senderName: 'Satish (Manager)', text: 'Great. Can you share the file?' },
  ],
  3: [
    { id: 301, sender: 'manager', senderName: 'Satish (Manager)', text: 'Reminder: Marketing Campaign meeting at 3 PM.' },
    { id: 302, sender: 'me', senderName: 'Me', text: 'Got it, thanks!' },
  ],
};
// --- End Static Data ---


const Chat = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messageListRef = useRef(null);
  const [projects] = useState(staticProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [allMessages, setAllMessages] = useState(staticMessages);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setCurrentMessages(allMessages[selectedProjectId] || []);
  }, [selectedProjectId, allMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      e.target.value = null;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile || !selectedProjectId) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      senderName: 'Me',
      text: message,
      file: selectedFile ? { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type } : null,
      timestamp: new Date().toISOString(),
    };

    console.log(`Sending message to project ${selectedProjectId}:`, newMessage);

    setAllMessages(prevMessages => {
        const projectMessages = prevMessages[selectedProjectId] || [];
        return {
          ...prevMessages,
          [selectedProjectId]: [...projectMessages, newMessage],
        };
      });

    setMessage('');
    setSelectedFile(null);
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
     }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setIsSidebarOpen(false);
  };


  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col z-50
        w-4/5 max-w-xs transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-1/3 md:z-auto
        lg:w-1/4
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0 flex items-center justify-between">
          <div className='flex items-center ms-16'>
             {/* --- LOGO IMAGE --- */}
             <img src={logo} alt="Logo" className="w-16  object-contain" /> 
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Project List Area */}
        <div className="flex-grow overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
              className={`block p-4 cursor-pointer border-l-4 ${
                selectedProjectId === project.id
                  ? 'border-purple-500 bg-gray-700/50'
                  : 'border-transparent hover:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                 <FaProjectDiagram className="text-purple-400 shrink-0"/>
                 <h3 className="font-semibold truncate flex-1">{project.name}</h3>
              </div>
              <p className="text-sm text-gray-400 truncate pl-7">{project.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full w-full md:w-2/3 lg:w-3/4">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0 bg-gray-800 flex items-center">
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-gray-400 hover:text-white">
             <FaBars size={20} />
           </button>
           <h2 className="text-xl font-bold text-center flex-1">
             {projects.find(p => p.id === selectedProjectId)?.name || 'Select a Project'}
           </h2>
         </div>

        {/* Message List */}
        <div
          ref={messageListRef}
          className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-900"
        >
          {currentMessages.length > 0 ? (
            currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs text-gray-400 mb-1 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={`p-3 rounded-lg max-w-[80%] sm:max-w-lg text-sm md:text-base break-words ${
                    msg.sender === 'me'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-gray-700 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.file && (
                    <div className="mt-2 p-2 bg-black/20 rounded-md text-sm break-all">
                      <strong>File:</strong> {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
             <div className="flex items-center justify-center h-full text-gray-500 text-center px-4">
               {selectedProjectId ? "No messages yet. Start the conversation!" : "Select a project from the sidebar to view the chat."}
             </div>
          )}
        </div>

        {/* Input Area */}
        {selectedProjectId && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800">
            {selectedFile && (
              <div className="mb-2 px-3 py-2 bg-gray-700 rounded-md text-sm flex justify-between items-center break-all">
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  className="text-gray-400 hover:text-white ml-2 shrink-0"
                >
                  <IoClose />
                </button>
              </div>
            )}
            <div className="flex items-center md:gap-2 gap-0.5">
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
                aria-label="Attach file"
              >
                <IoAttach size={22} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white disabled:opacity-50"
                aria-label="Send message"
                disabled={!message.trim() && !selectedFile}
              >
                <IoSend size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;