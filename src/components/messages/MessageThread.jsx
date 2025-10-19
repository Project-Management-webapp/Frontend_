import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { RiMessage3Line } from "react-icons/ri";
import { getProjectMessages, sendMessage, deleteMessage, replyToMessage } from "../../api/common/message";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

const MessageThread = ({ projectId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getProjectMessages(projectId);
      // Normalize to array
      let messagesArray = [];
      if (Array.isArray(data)) messagesArray = data;
      else if (Array.isArray(data?.data)) messagesArray = data.data;
      else if (Array.isArray(data?.messages)) messagesArray = data.messages;
      else if (Array.isArray(data?.data?.messages)) messagesArray = data.data.messages;
      setMessages(messagesArray);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async ({ message, files }) => {
    try {
      if (replyTo) {
        await replyToMessage(replyTo.id, { message, files });
        setReplyTo(null);
      } else {
        await sendMessage({ projectId, message, files });
      }
      toast.success("Message sent!");
      fetchMessages();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to send message");
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Delete this message?")) return;

    try {
      await deleteMessage(messageId);
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to delete message");
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white/5 backdrop-blur-md rounded-lg border border-white/20">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <RiMessage3Line size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Project Discussion</h3>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Chat with your team members and manager about this project
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <RiMessage3Line size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                currentUserId={currentUserId}
                onReply={handleReply}
                onDelete={handleDelete}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        disabled={loading}
      />
    </div>
  );
};

export default MessageThread;
