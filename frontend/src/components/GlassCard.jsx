import React, { useRef } from 'react';

/**
 * GlassCard Component
 * Reusable premium glassmorphism card container with interactive effects
 */
function GlassCard({ children, className = '', hover = false, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!hover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default GlassCard;
