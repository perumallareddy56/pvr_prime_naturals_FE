import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import useReveal from '../hooks/useReveal';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  LuLayoutGrid, 
  LuSearch, 
  LuPackage, 
  LuChevronRight,
  LuSparkles,
  LuFilter
} from 'react-icons/lu';
import Pagination from '../components/Pagination';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState('');
  const itemsPerPage = 8;
  
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  const { stompClient, connected } = useWebSocket();

  useReveal([loading]);

  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory);
    fetchCategories();
    setCurrentPage(1); // Reset to page 1 on filter change
    setLocalSearch(searchQuery);
  }, [searchQuery, selectedCategory]);

  // Real-time Catalog Sync
  useEffect(() => {
    if (connected && stompClient) {
      const sub = stompClient.subscribe('/topic/products/sync', () => {
        fetchProducts(searchQuery, selectedCategory);
      });
      return () => sub.unsubscribe();
    }
  }, [connected, stompClient, searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/types');
      setCategories(res.data);
    } catch (e) { 
      console.error("Error fetching categories", e); 
    }
  };

  const fetchProducts = async (query = '', category = 'All') => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.search = query;
      if (category !== 'All') params.type = category;

      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const success = await addToCart(product.id, 1);
    if (success) {
      api.post('/live/pulse', { 
        message: `✨ Someone just discovered our premium ${product.name}!`, 
        type: 'DISCOVERY' 
      });
    }
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    if (searchQuery) {
      navigate('/products');
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch) {
      navigate(`/products?search=${localSearch}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="products-page bg-charcoal min-vh-100 py-5">
      <Container className="reveal mt-4">
        <div className="text-center mb-5">
          <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Our Collection</span>
          <h2 className="text-white fw-bold display-4 mb-2">Our Premium <span className="text-gold">Spice</span> Collection</h2>
          <div className="title-underline mx-auto mt-3"></div>
          <p className="text-white smallest text-uppercase letter-spacing-1 mt-3">Hand-selected • Stone-ground • Farm-fresh</p>
          
          {searchQuery && (
            <div className="text-white opacity-75 mt-4 small">
              <LuSearch className="me-2 text-gold" /> SEARCHING FOR: "<span className="text-gold fw-bold">{searchQuery}</span>"
            </div>
          )}

          <div className="catalog-search-nexus mt-5 mx-auto reveal" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSearchSubmit} className="position-relative">
                  <input 
                      type="text"
                      className="catalog-search-input w-100 py-3 ps-4 pe-5 rounded-pill bg-charcoal text-white border-white border-opacity-10 shadow-inner smallest letter-spacing-1"
                      placeholder="DISCOVER ARTISANAL SPICES..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <button type="submit" className="position-absolute end-0 top-0 h-100 border-0 bg-transparent px-4 text-gold hvr-grow">
                      <LuSearch size={18} />
                  </button>
              </form>
          </div>
        </div>

        {/* Category Filters - Modern Glassmorphism */}
        {!loading && (
          <div className="d-flex flex-wrap gap-2 mb-5 justify-content-center">
            <button 
              className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('All')}
            >
              <LuLayoutGrid className="me-2" size={14} /> ALL CATEGORIES
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`filter-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" variant="warning" />
          </div>
        ) : products.length > 0 ? (
          <>
            <Row className="g-4">
              {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard 
                    product={product} 
                    addToCart={handleAddToCart} 
                    toggleWishlist={toggleWishlist} 
                    isInWishlist={isInWishlist}
                  />
                </Col>
              ))}
            </Row>
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="empty-state glass-panel p-5 rounded-5 border border-white border-opacity-5 text-center reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
            <LuPackage className="text-gold opacity-10 mb-4 hvr-bounce" size={80} />
            <h3 className="text-white fw-bold mb-3">No Products Found</h3>
            <p className="text-muted mb-5 mx-auto smallest text-uppercase letter-spacing-1" style={{maxWidth: '400px'}}>
              We couldn't find any products matching your search. 
              Try adjusting your filters or resetting the search.
            </p>
            <Button 
              variant="warning"
              className="rounded-pill px-5 py-3 fw-bold shadow-premium shimmer"
              onClick={() => { setSelectedCategory('All'); navigate('/products'); fetchProducts(''); }}
            >
              RESET FILTERS
            </Button>
          </div>
        )}
      </Container>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        
        .title-underline {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--pvr-gold), transparent);
          border-radius: 2px;
        }

        .filter-chip {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.5);
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
        }

        .filter-chip:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
          color: var(--pvr-gold);
        }

        .filter-chip.active {
          background: var(--pvr-gold);
          color: #000 !important;
          border-color: var(--pvr-gold);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .empty-state {
            background: linear-gradient(145deg, rgba(255,255,255,0.02), rgba(0,0,0,0));
        }

        .catalog-search-input {
            transition: all 0.3s ease;
        }
        .catalog-search-input:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
            outline: none;
        }

        .hvr-bounce:hover { transform: scale(1.1); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default Products;
