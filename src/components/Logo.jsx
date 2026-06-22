import React from 'react';
import { LuCpu } from 'react-icons/lu';

const Logo = ({ height = '45px', className = '' }) => {
  return (
    <div className={`logo-nexus-wrapper d-flex align-items-center ${className}`}>
      <div 
        className="logo-image-hull d-flex align-items-center justify-content-center"
        style={{ height: height }}
      >
        <img 
          src="/logo-pvr.png" 
          alt="PVR" 
          className="brand-mark-img"
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
        />
      </div>
      <style>{`
        .logo-nexus-wrapper {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .logo-image-hull {
            filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
            transition: inherit;
        }
        .logo-nexus-wrapper:hover .logo-image-hull {
            transform: scale(1.08) rotate(-2deg);
            filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
        }
        .brand-mark-img {
            display: block;
        }
      `}</style>
    </div>
  );
};

export default Logo;
