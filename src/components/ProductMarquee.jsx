import React from 'react';
import { Link } from 'react-router-dom';
import { LuShoppingBag, LuEye } from 'react-icons/lu';
import './ProductMarquee.css';

const ProductMarquee = ({ products }) => {
  if (!products || products.length === 0) return null;

  // Use up to 10 products
  const displayProducts = products.slice(0, 10);
  const itemsCount = displayProducts.length;

  return (
    <div className="marquee-container" mask="true" style={{ '--items': itemsCount }}>
      {displayProducts.map((product, index) => (
        <article 
          key={product.id} 
          style={{ '--i': index }}
          className="marquee-card shadow-sm"
        >
          <div className="marquee-img-wrapper d-flex align-items-center justify-content-center" style={{ gridRow: '1', background: '#120e0b' }}>
            <img 
              src={product.imageUrl || '/assets/products/pickle.png'} 
              alt={product.name} 
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                e.target.onerror = null;
                // If it fails, degrade gracefully replacing it with a placeholder aesthetic
                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22280%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20280%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a0b0d3e0%20text%20%7B%20fill%3A%23d4af37%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a0b0d3e0%22%3E%3Crect%20width%3D%22280%22%20height%3D%22200%22%20fill%3D%22%23120e0b%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285%22%20y%3D%22105%22%3EPVR%20PRIME%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
              }}
            />
          </div>
          
          <div className="marquee-header pt-3" style={{ gridRow: '2' }}>
            <span className="text-gold smallest fw-bold text-uppercase letter-spacing-1 d-block mb-1">
                {product.subCategory?.productType?.name || 'Artisanal'}
            </span>
            <h2 className="marquee-title h5 fw-bold mb-0 text-white text-truncate">{product.name}</h2>
          </div>

          <div className="marquee-body" style={{ gridRow: '3' }}>
            <p className="marquee-desc small text-white mb-0">
                {product.description || "Premium hand-picked essentials from our artisanal collection, crafted to perfection."}
            </p>
          </div>
            
          <div className="marquee-footer d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-5" style={{ gridRow: '4' }}>
            <span className="marquee-price h4 fw-bold text-gold mb-0">₹{product.price.toFixed(2)}</span>
            <Link to={`/product/${product.id}`} className="marquee-btn btn-sm d-flex align-items-center gap-2">
              <span>EXPLORE</span>
              <LuEye size={14} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProductMarquee;
