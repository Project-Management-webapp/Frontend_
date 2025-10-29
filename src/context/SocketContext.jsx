import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userStatuses, setUserStatuses] = useState({}); // Track online/offline status of users

  useEffect(() => {
    // Get backend URL from environment or default
    const backendURL = import.meta.env.VITE_API_URL;
    console.log('🔌 Connecting to Socket.IO server at:', backendURL);
    
    // Initialize socket connection
    const socketInstance = io(backendURL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
      
      // Register user as online when connected
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('fullName') || 'User';
      const userRole = localStorage.getItem('userRole');
      
      if (userId) {
        socketInstance.emit('user_online', { userId, userName, userRole });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for user status changes
    socketInstance.on('user_status_changed', ({ userId, status }) => {
      console.log(`👤 User ${userId} is now ${status}`);
      setUserStatuses(prev => ({ ...prev, [userId]: status }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinProject = (projectId) => {
    if (socket && projectId) {
      // Ensure projectId is consistent (convert to string for room name)
      const projectIdStr = String(projectId);
      const userId = localStorage.getItem('userId');
      socket.emit('join_project', { projectId: projectIdStr, userId });
      console.log(`📍 Emitted join_project for: ${projectIdStr}`);
    } else {
      console.log('⚠ Cannot join project - socket:', !!socket, 'projectId:', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket && projectId) {
      const projectIdStr = String(projectId);
      socket.emit('leave_project', projectIdStr);
      console.log(`👋 Emitted leave_project for: ${projectIdStr}`);
    }
  };

  const emitTyping = (projectId, userName) => {
    if (socket && projectId) {
      socket.emit('typing', { projectId, userName });
    }
  };

  const emitStopTyping = (projectId) => {
    if (socket && projectId) {
      socket.emit('stop_typing', { projectId });
    }
  };

  const checkUserStatus = (userId, callback) => {
    if (socket && userId) {
      socket.emit('check_user_status', { userId }, callback);
    }
  };

  const getUserStatus = (userId) => {
    return userStatuses[userId] || 'offline';
  };

  const value = {
    socket,
    isConnected,
    userStatuses,
    joinProject,
    leaveProject,
    emitTyping,
    emitStopTyping,
    checkUserStatus,
    getUserStatus,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};