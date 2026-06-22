import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { LuHeart, LuEye, LuShoppingBag, LuShieldCheck, LuFlame, LuTrendingUp } from 'react-icons/lu';

const ProductCard = ({ product, addToCart, toggleWishlist, isInWishlist }) => {
  const { productStock, stompClient, connected } = useWebSocket();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const currentStock = productStock[product.id] !== undefined ? productStock[product.id] : product.stockQuantity;

  // Simulate real-time views for "Trending" feel
  const [viewCount, setViewCount] = React.useState(Math.floor(Math.random() * 50) + 10);
  
  React.useEffect(() => {
    if (productStock[product.id] !== undefined) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [productStock[product.id]]);

  const isTrending = product.id % 2 === 0; // Mock trending logic for demo

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="product-card-v3 h-100"
    >
      <Card className="h-100 glass-panel border-0 overflow-hidden hover-lift" style={{ background: 'var(--pvr-charcoal-light)', borderRadius: '24px' }}>
        <div className="product-image-container position-relative overflow-hidden">
          <Card.Img
            variant="top"
            src={product.imageUrl || '/assets/products/cardamom.png'}
            className="product-image-trending transition-all"
            style={{ height: '260px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22280%22%20height%3D%22260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20280%20260%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a0b0d3e0%20text%20%7B%20fill%3A%23d4af37%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a0b0d3e0%22%3E%3Crect%20width%3D%22280%22%20height%3D%22260%22%20fill%3D%22%23120e0b%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285%22%20y%3D%22140%22%3EPVR%20PRIME%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            }}
          />
          
          {/* Trending Badge Overlay */}
          {isTrending && (
              <div className="position-absolute top-0 start-0 m-3 z-3">
                  <div className="trending-badge-live px-3 py-1 animate-trending" style={{ background: 'rgba(255, 69, 0, 0.15)', color: '#ff4500', borderColor: 'rgba(255, 69, 0, 0.3)' }}>
                      <LuFlame className="me-1" /> HOT
                  </div>
              </div>
          )}

          {/* Floating Actions */}
          <div className="floating-actions-v3 d-flex flex-column gap-2 p-3 position-absolute top-0 end-0 z-3">
            <Button 
              variant="link" 
              className="glass-action-btn-v3 rounded-circle p-2"
              onClick={() => toggleWishlist(product)}
            >
              <LuHeart size={18} className={isInWishlist(product.id) ? 'text-danger fill-danger' : 'text-white'} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </Button>
            <Button 
              as={Link} 
              to={`/product/${product.id}`}
              variant="link" 
              className="glass-action-btn-v3 rounded-circle p-2 text-white"
            >
              <LuEye size={18} />
            </Button>
          </div>

          <div className="image-bottom-overlay"></div>
          
          {/* Live View Count */}
          <div className="position-absolute bottom-0 end-0 m-3 z-3 px-2 py-1 glass-panel border-0 rounded-pill" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span className="text-white fw-bold small" style={{ fontSize: '0.6rem' }}>
                  <span className="live-dot me-1"></span> {viewCount} DISCOVERING
              </span>
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-gold fw-bold small text-uppercase letter-spacing-2" style={{ fontSize: '0.65rem' }}>
              {product.subCategory?.productType?.name || product.category?.name || 'Artisanal'}
            </span>
            {isUpdating && (
               <span className="text-cyan small fw-bold live-update-pop" style={{ color: 'var(--trending-cyan)', fontSize: '0.65rem' }}>
                ⚡ LIVE SYNC
              </span>
            )}
          </div>
          
          <Card.Title className="fw-bold mb-1 h5 text-truncate" title={product.name} style={{ color: '#ffffff', letterSpacing: '-0.5px' }}>
            {product.name}
          </Card.Title>

          <p className="smallest text-uppercase letter-spacing-1 mb-4 text-truncate" style={{ color: '#ffffff', fontSize: '0.6rem' }}>
            {product.description || 'Premium artisanal culinary essential'}
          </p>

          <div className="d-flex align-items-center gap-2 mb-4">
             <span className="text-gold h4 fw-bold mb-0">₹{product.price.toFixed(2)}</span>
             {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                 <span className="text-danger small fw-bold ms-auto" style={{ fontSize: '0.6rem' }}>ONLY {currentStock} LEFT</span>
             )}
          </div>
          
          <Button 
            variant="primary" 
            className="w-100 rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 border-0 trending-glow"
            onClick={() => {
              addToCart(product);
            }}
            disabled={currentStock === 0 || product.active === false}
          >
            <LuShoppingBag size={18} />
            <span>{currentStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
          </Button>
        </Card.Body>
      </Card>

      <style>{`
        .glass-action-btn-v3 {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition-smooth);
        }
        .glass-action-btn-v3:hover {
          background: var(--pvr-gold);
          color: black !important;
          transform: scale(1.1);
        }
        .image-bottom-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,7,6,0.8), transparent 50%);
          pointer-events: none;
        }
        .product-image-trending { transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1); }
        .product-card-v3:hover .product-image-trending { transform: scale(1.1); }
        .text-cyan { color: var(--trending-cyan); }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
