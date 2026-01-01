import React, { useEffect, useState } from 'react';

const Toast = ({ message, isVisible, onClose, accentColor = '#6366f1' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: `translateX(-50%) translateY(${show ? '0' : '100px'})`,
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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: show ? 1 : 0,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      {message}
    </div>
  );
};

export default Toast;
