import React from 'react';
import useLivePresence from '../hooks/useLivePresence';

const LiveAudienceCounter = () => {
    const count = useLivePresence();

    if (count === 0) return null;

    return (
        <div className="live-presence-badge d-flex align-items-center gap-2">
            <div className="presence-dot-outer">
                <div className="presence-dot-inner pulse-gold"></div>
            </div>
            <span className="presence-text text-uppercase fw-bold">
                <span className="text-warning">{count}</span> Connoisseurs Active Now
            </span>
        </div>
    );
};

export default LiveAudienceCounter;
