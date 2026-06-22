import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_EVENTS = [
  "Mumbai just purchased Premium Saffron",
  "Delhi just ordered Arabica Coffee Blend",
  "Bangalore is viewing Stone-ground Turmeric",
  "London just purchased 5x Gourmet Sampler",
  "New York added Signature Essentials to cart"
];

const LiveActivityFeed = () => {
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    // Wait a few seconds before starting the feed
    const initialDelay = setTimeout(() => {
      triggerEvent();
      
      // Setup interval for random periodic events
      const interval = setInterval(() => {
        triggerEvent();
      }, 12000); // New event every 12 seconds
      
      return () => clearInterval(interval);
    }, 4000);
    
    return () => clearTimeout(initialDelay);
  }, []);

  const triggerEvent = () => {
    const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
    setCurrentEvent({ id: Date.now(), text: randomEvent });
    
    // Auto-hide the event after 5 seconds
    setTimeout(() => {
      setCurrentEvent(null);
    }, 5000);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '30px', 
        left: '30px', 
        zIndex: 9999, 
        pointerEvents: 'none' 
      }}
    >
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel"
            style={{
              padding: '12px 24px',
              borderRadius: '50px',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              background: 'rgba(15, 12, 11, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div className="live-dot" style={{ width: '8px', height: '8px', backgroundColor: '#39ff14', borderRadius: '50%', boxShadow: '0 0 10px #39ff14' }}></div>
            <span className="text-white fw-bold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
              {currentEvent.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityFeed;
