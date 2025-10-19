import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#0f172a', // bg-slate-900
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentContainerStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headingStyle = {
    color: '#ac51fc',
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '30px 0 10px 0',
  };

  const textStyle = {
    color: '#cbd5e1', // Adjusted for better contrast on dark bg
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '40px',
    maxWidth: '500px',
  };

  const buttonStyle = {
    backgroundColor: '#ac51fc',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    boxShadow: '0 4px 15px rgba(172, 81, 252, .3)',
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -90 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6, ease: "easeOut" } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: '0 6px 20px rgba(172, 81, 252, .5)' }
  };

  const blobBaseStyle = {
    position: 'absolute',
    width: '24rem', // w-96
    height: '24rem', // h-96
    borderRadius: '9999px', // rounded-full
    filter: 'blur(72px)', // blur-3xl
    opacity: 0.5,
    animation: 'blob 8s infinite',
  };

  const blob1Style = {
    ...blobBaseStyle,
    top: '0',
    left: '-33.33%',
    backgroundColor: 'rgba(96, 165, 250, 0.5)', // bg-blue-400/50
    animationDelay: '0s',
  };

  const blob2Style = {
    ...blobBaseStyle,
    top: '0',
    right: '-25%',
    backgroundColor: 'rgba(216, 180, 254, 0.5)', // bg-purple-300/50
    animationDelay: '2s',
  };

  const blob3Style = {
    ...blobBaseStyle,
    bottom: '-25%',
    left: '5rem', // left-20
    backgroundColor: 'rgba(147, 197, 253, 0.5)', // bg-blue-300/50
    animationDelay: '4s',
  };

  const keyframes = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={blob1Style}></div>
      <div style={blob2Style}></div>
      <div style={blob3Style}></div>
      
      <div style={contentContainerStyle}>
        <motion.svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="30"
            stroke="#ac51fc"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.line
            x1="62"
            y1="62"
            x2="85"
            y2="85"
            stroke="#ac51fc"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          />
          <motion.circle
            cx="40"
            cy="40"
            r="8"
            fill="#e74c3c"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: "backOut" }}
          />
          <motion.line
            x1="25"
            y1="25"
            x2="55"
            y2="55"
            stroke="#ac51fc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          />
        </motion.svg>

        <motion.h1
          style={headingStyle}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          style={textStyle}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>

        <motion.button
          style={buttonStyle}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => window.location.href = '/'}
        >
          Go Back Home
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;