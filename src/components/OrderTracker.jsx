import React from 'react';
import { 
  LuList, 
  LuBox
} from 'react-icons/lu';
import { 
  FiHome, 
  FiTruck, 
  FiXCircle 
} from 'react-icons/fi';
import './OrderTracker.css';

const OrderTracker = ({ status }) => {
  // Define mapping from backend status to tracker stage index
  const getStageIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
      case 'PLACED':
      case 'PACKED':
        return 0; // Processing
      case 'SHIPPED':
        return 1; // Shipped
      case 'OUT_FOR_DELIVERY':
        return 2; // In Transit
      case 'DELIVERED':
        return 3; // Delivered
      case 'CANCELLED':
        return -1; // Cancelled
      default:
        return 0;
    }
  };

  const currentStage = getStageIndex(status);
  const isCancelled = currentStage === -1;

  const stages = [
    { label: 'Processing', icon: LuList },
    { label: 'Shipped', icon: LuBox },
    { label: 'In Transit', icon: FiTruck },
    { label: 'Delivered', icon: FiHome }
  ];

  // Calculate progress width percentage (0 to 100)
  const progressWidth = isCancelled ? 0 : (currentStage / (stages.length - 1)) * 100;

  return (
    <div className="order-tracker-container">
      {isCancelled ? (
        <div className="cancelled-state d-flex flex-column align-items-center justify-content-center py-3">
          <FiXCircle size={48} className="text-danger mb-2 cancelled-icon" />
          <h5 className="text-danger fw-bold text-uppercase letter-spacing-2 mb-0" style={{fontSize: '0.9rem'}}>Order Cancelled</h5>
        </div>
      ) : (
        <div className="tracker-wrapper">
          {/* Background Dotted Line */}
          <div className="tracker-line-bg"></div>
          
          {/* Active Progress Line */}
          <div 
            className="tracker-line-progress" 
            style={{ width: `calc(${progressWidth}% )` }}
          ></div>

          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index <= currentStage;
            const isCurrent = index === currentStage;

            return (
              <div key={index} className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="icon-wrapper glass-panel">
                  <Icon className="step-icon" size={28} />
                </div>
                <span className="step-label">{stage.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
