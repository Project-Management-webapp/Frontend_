import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoVideocam, IoVideocamOff, IoMic, IoMicOff, IoCall } from 'react-icons/io5';
import { useSocket } from '../../context/SocketContext';

const VideoCall = ({ projectId, projectName, onClose, currentUserId, currentUserName, showToast }) => {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);
  
  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const remoteVideoRefs = useRef(new Map());

  // ICE servers configuration (using public STUN servers)
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    initializeCall();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Handle incoming offer
    socket.on('webrtc_offer', handleIncomingOffer);
    
    // Handle incoming answer
    socket.on('webrtc_answer', handleIncomingAnswer);
    
    // Handle ICE candidate
    socket.on('webrtc_ice_candidate', handleIncomingIceCandidate);
    
    // Handle user joined
    socket.on('user_joined_video_call', handleUserJoined);
    
    // Handle user left
    socket.on('user_left_video_call', handleUserLeft);
    
    // Handle call ended
    socket.on('video_call_ended', handleCallEnded);
    
    // Handle media changes
    socket.on('user_media_changed', handleMediaChanged);

    return () => {
      socket.off('webrtc_offer', handleIncomingOffer);
      socket.off('webrtc_answer', handleIncomingAnswer);
      socket.off('webrtc_ice_candidate', handleIncomingIceCandidate);
      socket.off('user_joined_video_call', handleUserJoined);
      socket.off('user_left_video_call', handleUserLeft);
      socket.off('video_call_ended', handleCallEnded);
      socket.off('user_media_changed', handleMediaChanged);
    };
  }, [socket, localStream]);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join video call room
      socket?.emit('join_video_call', {
        projectId,
        userId: currentUserId,
        userName: currentUserName
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (showToast) {
        showToast('Could not access camera/microphone. Please check permissions.', 'error');
      }
      onClose();
    }
  };

  const createPeerConnection = (remoteSocketId) => {
    const pc = new RTCPeerConnection(iceServers);

    // Add local stream tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from:', remoteSocketId);
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev).set(remoteSocketId, remoteStream));
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('webrtc_ice_candidate', {
          candidate: event.candidate,
          to: remoteSocketId,
          from: socket.id
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeerConnection(remoteSocketId);
      }
    };

    peerConnections.current.set(remoteSocketId, pc);
    return pc;
  };

  const handleUserJoined = async ({ userId, userName, socketId }) => {
    console.log('User joined video call:', userName, socketId);
    setParticipants(prev => [...prev, { userId, userName, socketId }]);

    // Create offer for new user
    const pc = createPeerConnection(socketId);
    
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      socket?.emit('webrtc_offer', {
        offer,
        to: socketId,
        from: socket.id,
        fromName: currentUserName
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleIncomingOffer = async ({ offer, from, fromName }) => {
    console.log('Received offer from:', fromName, from);
    
    let pc = peerConnections.current.get(from);
    if (!pc) {
      pc = createPeerConnection(from);
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket?.emit('webrtc_answer', {
        answer,
        to: from,
        from: socket.id
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleIncomingAnswer = async ({ answer, from }) => {
    console.log('Received answer from:', from);
    
    const pc = peerConnections.current.get(from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    }
  };

  const handleIncomingIceCandidate = async ({ candidate, from }) => {
    const pc = peerConnections.current.get(from);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  };

  const handleUserLeft = ({ userId, userName }) => {
    console.log('User left video call:', userName);
    setParticipants(prev => prev.filter(p => p.userId !== userId));
    
    // Find and remove peer connection for this user
    const socketId = participants.find(p => p.userId === userId)?.socketId;
    if (socketId) {
      removePeerConnection(socketId);
    }
  };

  const handleCallEnded = () => {
    if (showToast) {
      showToast('Call has been ended by the host', 'info');
    }
    cleanup();
    onClose();
  };

  const handleMediaChanged = ({ userId, mediaType, enabled }) => {
    // Update UI to show user's media state
    console.log(`User ${userId} ${mediaType} is now ${enabled ? 'enabled' : 'disabled'}`);
  };

  const removePeerConnection = (socketId) => {
    const pc = peerConnections.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(socketId);
    }
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(socketId);
      return newMap;
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        socket?.emit('toggle_media', {
          projectId,
          userId: currentUserId,
          mediaType: 'video',
          enabled: videoTrack.enabled
        });
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        socket?.emit('toggle_media', {
          projectId,
          userId: currentUserId,
          mediaType: 'audio',
          enabled: audioTrack.enabled
        });
      }
    }
  };

  const endCall = () => {
    socket?.emit('end_video_call', {
      projectId,
      userId: currentUserId,
      userName: currentUserName
    });
    
    cleanup();
    onClose();
  };

  const cleanup = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();

    // Leave video call room
    socket?.emit('leave_video_call', {
      projectId,
      userId: currentUserId,
      userName: currentUserName
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">{projectName}</h2>
          <p className="text-sm text-gray-400">
            {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={endCall}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={32} />
        </button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        {/* Local Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">You</span>
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-white">
                    {currentUserName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-medium">{currentUserName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
          const participant = participants.find(p => p.socketId === socketId);
          return (
            <div key={socketId} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={el => {
                  if (el && stream) {
                    el.srcObject = stream;
                    remoteVideoRefs.current.set(socketId, el);
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  {participant?.userName || 'Participant'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6 flex items-center justify-center gap-4 border-t border-gray-700">
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <IoVideocam size={24} /> : <IoVideocamOff size={24} />}
        </button>

        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all ${
            isAudioEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
        >
          {isAudioEnabled ? <IoMic size={24} /> : <IoMicOff size={24} />}
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
          title="End call"
        >
          <IoCall size={24} className="rotate-135" />
        </button>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
        .rotate-135 {
          transform: rotate(135deg);
        }
      `}</style>
    </div>
  );
};

export default VideoCall;
