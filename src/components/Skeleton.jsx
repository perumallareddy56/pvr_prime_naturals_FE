import React from 'react';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div 
      className={`skeleton-base ${className}`} 
      style={{ 
        width, 
        height, 
        borderRadius,
        background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite linear'
      }} 
    />
  );
};

export default Skeleton;
