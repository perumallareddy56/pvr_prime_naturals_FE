import React, { useContext } from 'react';
import { Navbar, Nav, Container, Badge, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  LuMapPin, 
  LuPhone, 
  LuSearch, 
  LuHeart, 
  LuShoppingBag, 
  LuLayoutDashboard, 
  LuUser, 
  LuReceipt, 
  LuLogOut, 
  LuLogIn, 
  LuUserPlus,
  LuInstagram,
  LuFacebook,
  LuTruck
} from 'react-icons/lu';
import Logo from './Logo';

import TrendingTicker from './TrendingTicker';

const Navigation = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { stompClient, connected, presenceCount } = useWebSocket();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Scroll effect for modern navbar
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="header-wrapper position-absolute w-100" style={{ zIndex: 1050, top: 0, left: 0 }}>
      <Navbar 
        expand="lg" 
        className={`navbar-custom transition-all w-100 ${isScrolled ? 'fixed-top navbar-scrolled shadow-premium py-2' : 'py-3'}`}
        style={{ position: isScrolled ? 'fixed' : 'relative', top: 0 }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 p-0">
            <Logo height="40px" />
            <span className="brand-text d-none d-sm-block fw-bold text-uppercase letter-spacing-2" style={{color: 'var(--pvr-gold)', fontSize: '1.2rem'}}>PVR PRIME NATURALS</span>
          </Navbar.Brand>
          
          <div className="d-flex align-items-center order-lg-last ms-auto">
            <div className="d-flex align-items-center gap-2 gap-sm-3 me-2 me-lg-0">
              <Link to="/wishlist" className="position-relative nav-icon-link text-white">
                <LuHeart size={20} className={wishlist.length > 0 ? 'text-danger animate-trending' : ''} />
                {wishlist.length > 0 && <span className="badge-dot" />}
              </Link>
              
              <Link to="/cart" className="position-relative nav-icon-link text-white">
                <LuShoppingBag size={20} className="text-gold" />
                {cartCount > 0 && <span className="badge-count animate-bounce">{cartCount}</span>}
              </Link>
              
              {currentUser ? (
                <div className="user-actions d-flex align-items-center gap-2 gap-sm-3 ms-1">
                  <Link to={isAdmin() ? "/admin" : "/profile"} className="nav-icon-link text-white" title="Profile">
                    <LuUser size={20} />
                  </Link>
                  <Button 
                    variant="outline-danger" 
                    onClick={handleLogout} 
                    className="rounded-pill px-2 py-1 px-sm-3 btn-sm fw-bold border-opacity-50 text-uppercase letter-spacing-1 d-flex align-items-center gap-1"
                    style={{ fontSize: '0.65rem' }}
                    title="Logout"
                  >
                    <LuLogOut size={14} /> <span className="d-none d-sm-block">LOGOUT</span>
                  </Button>
                </div>
              ) : (
                <div className="auth-buttons d-flex gap-2 ms-1">
                  <Link to="/login" className="btn btn-outline-warning rounded-pill px-2 px-sm-4 btn-sm fw-bold" style={{ fontSize: '0.7rem' }}>Login</Link>
                </div>
              )}
            </div>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none filter-invert ms-2 p-0">
              <span className="navbar-toggler-icon" style={{width: '1.2em', height: '1.2em'}}></span>
            </Navbar.Toggle>
          </div>
  
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="search-container mx-auto mt-3 mt-lg-0 order-last order-lg-0">
              <Form className="d-flex" onSubmit={handleSearch}>
                <div className="search-pill d-flex align-items-center px-3 glass-panel" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <LuSearch className="text-gold opacity-50" />
                  <Form.Control
                    type="search"
                    placeholder="Search for spices, blends, and more..."
                    className="bg-transparent border-0 text-white shadow-none px-3 py-2"
                    style={{ minWidth: '200px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form>
            </div>
  
            <Nav className="me-auto align-items-center gap-lg-1">
              <Nav.Link as={Link} to="/products" className="nav-link-premium" style={{ color: 'var(--text-mid)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px' }}>PRODUCTS</Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link-premium" style={{ color: 'var(--text-mid)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px' }}>OUR STORY</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-premium" style={{ color: 'var(--text-mid)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px' }}>CONTACT US</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Ticker & Top bar fade out slightly on scroll or stay at absolute top. */}
      <div className={isScrolled ? 'd-none d-lg-block opacity-0 position-absolute' : 'd-block transition-all opacity-100'} style={{ zIndex: 1040, position: 'relative' }}>
        <TrendingTicker />
        
        {/* Premium Top Bar - Minimalist for Trending Look */}
        <div className="top-bar-premium d-none d-lg-block" style={{ background: 'var(--pvr-charcoal)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <Container className="d-flex justify-content-between align-items-center py-2">
            <div className="top-bar-info d-flex align-items-center gap-3">
              <span className="text-white smallest fw-bold letter-spacing-1 opacity-75">
                <LuTruck className="text-gold me-2" size={14} /> FREE DELIVERY ON ALL ORDERS
              </span>
            </div>
            <div className="top-bar-social d-flex align-items-center">
              <a href="#" className="ms-3 text-muted hover-gold transition-all"><LuInstagram /></a>
              <a href="#" className="ms-3 text-muted hover-gold transition-all"><LuFacebook /></a>
            </div>
          </Container>
        </div>
      </div>

      <style>{`
        .navbar-custom { z-index: 1050; }
        .search-pill:focus-within {
          background: rgba(255,255,255,0.1) !important;
          border-color: var(--pvr-gold) !important;
        }
        .nav-link-premium:hover { color: var(--pvr-gold) !important; }
        .nav-icon-link:hover { background: rgba(255,255,255,0.05); color: var(--pvr-gold) !important; }
        .filter-invert { filter: invert(1); }
        .top-bar-premium { transition: all 0.3s ease; }
      `}</style>
    </header>
  );
};

export default Navigation;
