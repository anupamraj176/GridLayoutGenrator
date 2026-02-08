import React, { useEffect, useState, useRef, useCallback } from 'react';

const Toast = ({ message, isVisible, onClose, accentColor = '#6366f1' }) => {
  const [show, setShow] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Clear any existing timers when a new toast is triggered
      clearTimers();
      
      // Update message and show toast immediately
      setCurrentMessage(message);
      setShow(true);
      
      // Set timer to hide the toast
      timerRef.current = setTimeout(() => {
        setShow(false);
        // Wait for exit animation before calling onClose
        hideTimerRef.current = setTimeout(() => {
          onClose();
        }, 300);
      }, 2500);
    }

    return () => clearTimers();
  }, [isVisible, message, onClose, clearTimers]);

  // Reset show state when visibility becomes false
  useEffect(() => {
    if (!isVisible) {
      clearTimers();
      setShow(false);
    }
  }, [isVisible, clearTimers]);

  if (!isVisible && !show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1.5rem',
      transform: `translateX(${show ? '0' : '120%'})`,
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
      color: 'white',
      padding: '0.875rem 1.5rem',
      borderRadius: '0.75rem',
      boxShadow: `0 10px 40px ${accentColor}66, 0 4px 20px rgba(0,0,0,0.3)`,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontWeight: '500',
      fontSize: '0.9375rem',
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: show ? 1 : 0,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      maxWidth: 'calc(100vw - 3rem)'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {currentMessage}
      </span>
      <button 
        onClick={() => {
          clearTimers();
          setShow(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          padding: '2px 6px',
          marginLeft: '0.5rem',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
