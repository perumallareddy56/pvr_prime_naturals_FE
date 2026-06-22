import React from 'react';
import { LuTrendingUp, LuFlame, LuZap } from 'react-icons/lu';

const TrendingTicker = () => {
    const trendingItems = [
        { text: "FREE DELIVERY ON ALL ORDERS", icon: <LuZap className="text-warning" /> },
        { text: "Bestseller: Arabica Coffee Blends", icon: <LuFlame className="text-danger" /> },
        { text: "Trending: Artisanal Stone-Ground Blends", icon: <LuTrendingUp className="text-info" /> },
        { text: "New Arrival: Premium Dry Fruit Collections", icon: <LuZap className="text-warning" /> },
        { text: "Hot: 50+ people viewing Signature Essentials", icon: <LuFlame className="text-danger" /> }
    ];
 
    return (
        <div className="trending-ticker-v2 border-bottom border-white border-opacity-10" style={{ background: '#120e0b', overflow: 'hidden', height: '24px', display: 'flex', alignItems: 'center' }}>
            <div className="marquee-content h-100 align-items-center">
                {[...trendingItems, ...trendingItems].map((item, idx) => (
                    <div key={idx} className="marquee-item d-flex align-items-center gap-1 mx-3 text-white fw-bold text-uppercase letter-spacing-1 h-100">
                        {item.icon}
                        <span style={{ lineHeight: 1, marginTop: '1px' }}>{item.text}</span>
                    </div>
                ))}
            </div>
            <style>{`
                .letter-spacing-1 { letter-spacing: 1px; }
                .marquee-item span { font-size: 0.65rem; display: inline-block; }
                .marquee-item svg { width: 14px; height: 14px; }
            `}</style>
        </div>
    );
};

export default TrendingTicker;
