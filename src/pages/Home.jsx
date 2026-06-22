import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ProductMarquee from '../components/ProductMarquee';
import useReveal from '../hooks/useReveal';
import { useWebSocket } from '../context/WebSocketContext';
import heroImage from '../assets/hero-premium.png';
import { MOCK_PRODUCTS } from '../mockData';
import { LuLeaf, LuCoffee, LuBox, LuCookie, LuGlassWater, LuShoppingBasket, LuGift, LuQuote, LuTrendingUp, LuFlame, LuZap, LuShieldCheck, LuTruck, LuAward, LuUsers, LuMail, LuNut } from 'react-icons/lu';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { presenceCount, stompClient, connected } = useWebSocket();
  const [activePulse, setActivePulse] = useState(null);
  const [showPulse, setShowPulse] = useState(false);
  useReveal();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  useEffect(() => {
    if (stompClient && connected) {
      const sub = stompClient.subscribe('/topic/global/activity', (message) => {
        const pulse = JSON.parse(message.body);
        setActivePulse(pulse);
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 4000);
      });
      return () => sub.unsubscribe();
    }
  }, [stompClient, connected]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products');
        // Fetch 14 products (10 for marquee, 4 for static best-sellers)
        setFeaturedProducts(response.data.slice(0, 14));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured products", error);
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 14));
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="landing-page bg-dark overflow-hidden">
      {/* Cinematic Hero */}
      <section className="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        <div className="hero-background-gradient-dark"></div>
        <Container className="position-relative pt-5 mt-5" style={{ zIndex: 10 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row className="align-items-center g-5">
              <Col lg={6} className="text-center text-lg-start">
                <div className="trending-badge-live mb-4 mx-auto mx-lg-0" style={{ background: 'var(--pvr-gold)', color: 'black', opacity: 1 }}>
                   <LuFlame className="animate-trending me-2" /> 
                   <span className="fw-bold">Trending: Top 1% Gourmet Essentials globally</span>
                </div>
                <motion.h1 variants={itemVariants} className="hero-title-main display-1 fw-bold mb-4">
                  The Essence of <br />
                  <span className="text-gold">Gourmet India</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="text-light opacity-75 mb-5 fs-5 pe-lg-5 fw-light letter-spacing-1">
                  From the misty hills of Wayanad to your kitchen, experience the unadulterated purity of stone-ground essentials and artisanal blends.
                </motion.p>
                <motion.div variants={itemVariants} className="hero-buttons d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/products" className="btn btn-primary px-5 py-3 fs-5 rounded-pill shadow-lg trending-glow">Explore Collection</Button>
                  <Button as={Link} to="/about" className="btn btn-outline-light px-5 py-3 fs-5 rounded-pill shadow-sm" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>Our Legacy</Button>
                </motion.div>
              </Col>
              <Col lg={6} className="d-none d-lg-block">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="hero-image-container position-relative"
                >
                  <div className="hero-image-glow-v2"></div>
                  <img src={heroImage} alt="Premium Gourmet" className="img-fluid floating-animation" style={{ filter: 'drop-shadow(0 0 80px rgba(212,175,55,0.25))' }} />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Artisanal Discovery Section (Categories) */}
      <section className="category-browse-section py-5 bg-charcoal">
        <Container className="py-5">
          <div className="text-center mb-5 reveal">
            <span className="section-label">Categories</span>
            <h2 className="display-4 text-white">Artisanal Discovery</h2>
          </div>
          <Row className="g-4">
            {[
              { name: 'Spices', icon: LuLeaf, color: 'var(--pvr-gold)', desc: 'Pure & Potent' },
              { name: 'Coffee', icon: LuCoffee, color: '#ff8c00', desc: 'Arabica Blends' },
              { name: 'Tea', icon: LuCoffee, color: '#39ff14', desc: 'Estate Fresh' },
              { name: 'Dry Fruits', icon: LuNut, color: '#00f2ff', desc: 'Nutrient Rich' },
              { name: 'Snacks', icon: LuCookie, color: '#f39c12', desc: 'Perfect Crunch' },
              { name: 'Pickles', icon: LuGlassWater, color: '#ff2e2e', desc: 'Sun-Aged' },
              { name: 'Groceries', icon: LuShoppingBasket, color: '#dee2e6', desc: 'Daily Staples' },
              { name: 'Combos', icon: LuGift, color: 'var(--pvr-gold)', desc: 'Gifting Ideas' }
            ].map((cat, idx) => (
              <Col key={idx} xs={6} md={3} className="reveal">
                <Link to={`/products?type=${cat.name}`} className="text-decoration-none">
                  <div className="glass-panel hover-lift p-4 text-center h-100" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="cat-icon-wrapper mb-3" style={{ color: cat.color }}>
                      <cat.icon size={42} className="animate-trending" />
                    </div>
                    <h5 className="text-light fw-bold mb-1" style={{ letterSpacing: '1px' }}>{cat.name}</h5>
                    <p className="text-white small mb-0">{cat.desc}</p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trending Now Section - Marquee Style */}
      <section className="trending-marquee-section py-5 bg-charcoal-light overflow-hidden">
          <Container>
             <div className="text-center mb-5 reveal">
                <span className="section-label">Real-time Spotlight</span>
                <h2 className="display-4 fw-bold text-white">Trending Now</h2>
                <p className="text-gold small fw-bold letter-spacing-2">BASED ON LIVE SALES & DISCOVERIES</p>
             </div>
          </Container>
          <div className="discovery-marquee-wrapper reveal">
             {loading ? (
                <Container><Row><Col className="text-center py-5"><div className="spinner-border text-gold" role="status"></div></Col></Row></Container>
             ) : (
                <ProductMarquee products={featuredProducts.slice(0, 10)} />
             )}
          </div>
      </section>

      {/* Artisanal Quality Benchmarks */}
      <section className="quality-benchmarks py-5 bg-dark">
        <Container className="py-5">
          <Row className="g-4 text-center">
            {[
              { icon: LuShieldCheck, title: 'Lab Tested', desc: 'Zero adulteration, 100% purity' },
              { icon: LuLeaf, title: 'Farm Direct', desc: 'Sourced from misty Wayanad hills' },
              { icon: LuZap, title: 'Stone Ground', desc: 'Cold-processed to retain aromas' },
              { icon: LuAward, title: 'Premium Grade', desc: 'Export quality standard essentials' }
            ].map((item, idx) => (
              <Col key={idx} md={3} className="reveal">
                <div className="benchmark-card p-4 h-100 rounded-4 border border-white border-opacity-5 hover-lift">
                  <div className="icon-hull mb-3 text-gold">
                    <item.icon size={40} className="animate-trending" />
                  </div>
                  <h5 className="text-gold fw-bold mb-2" style={{ filter: 'brightness(1.5)' }}>{item.title}</h5>
                  <p className="text-light opacity-75 small mb-0">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Artisanal Story - Split Screen */}
      <section className="artisanal-story py-5 bg-charcoal position-relative overflow-hidden">
        <div className="hero-background-gradient-dark opacity-50"></div>
        <Container className="py-5 position-relative">
          <Row className="align-items-center g-5">
            <Col lg={6} className="reveal">
              <div className="story-image-hull rounded-5 overflow-hidden shadow-premium">
                 <img src={heroImage} alt="The Process" className="img-fluid w-100" style={{ filter: 'grayscale(0.2) contrast(1.1)' }} />
              </div>
            </Col>
            <Col lg={6} className="reveal">
              <span className="section-label">Our Legacy</span>
              <h2 className="display-4 text-white fw-bold mb-4">Stone-Ground <span className="text-gold">Heritage</span></h2>
              <p className="text-light fs-5 opacity-75 mb-4 fw-light">
                At PVR, we believe that the soul of an ingredient lies in its processing. Our essentials aren't just ground; they are crafted through traditional methods that prevent heat buildup, preserving the volatile oils and intense aromas that mass-market brands lose.
              </p>
              <div className="d-flex align-items-center gap-3 mb-5">
                 <div className="stat-box">
                    <h3 className="text-gold fw-bold mb-0">15+</h3>
                    <p className="smallest text-muted text-uppercase mb-0">Master Blends</p>
                 </div>
                 <div className="vr bg-white opacity-10 mx-2"></div>
                 <div className="stat-box">
                    <h3 className="text-gold fw-bold mb-0">10k+</h3>
                    <p className="smallest text-muted text-uppercase mb-0">Happy Chefs</p>
                 </div>
              </div>
              <Button as={Link} to="/about" className="btn btn-outline-gold rounded-pill px-5 py-3">READ OUR STORY</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Best Sellers Grid */}
      <section className="best-sellers-section py-5 bg-dark">
         <Container className="py-5">
            <div className="text-center mb-5 reveal">
                <span className="section-label">Our Favorites</span>
                <h2 className="display-4 text-white">Best Sellers</h2>
            </div>
            <Row className="g-4">
                {loading ? [1,2,3,4].map(i => (
                    <Col md={3} key={i}><div className="skeleton-card shimmer" style={{ height: '400px' }}></div></Col>
                )) : featuredProducts.slice(10, 14).map((p) => (
                    <Col md={3} key={p.id} className="reveal">
                        <ProductCard product={p} addToCart={(prod) => addToCart(prod.id, 1)} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                    </Col>
                ))}
            </Row>
         </Container>
      </section>

      {/* Customer Testimonials */}
      <section className="testimonials-section py-5 bg-charcoal-light">
         <Container className="py-5">
            <div className="text-center mb-5 reveal">
                <span className="section-label">Customer Reviews</span>
                <h2 className="display-4 text-white">Trusted by Chefs</h2>
            </div>
            <Row className="g-4">
                {[
                  { name: "Ananya Sharma", role: "Executive Chef", quote: "The aroma of the PVR Signature Biryani Blend is unlike anything I've used in 20 years of professional cooking." },
                  { name: "Mark Wilson", role: "Home Maker", quote: "Finally found spices that don't lose their intensity after opening. The glassmorphic packaging is also stunning!" },
                  { name: "Rahul Varma", role: "Spice Sommelier", quote: "Pure stone-ground texture adds a unique mouthfeel to gravies. This is the gold standard for artisanal culinary essentials." }
                ].map((t, idx) => (
                  <Col key={idx} md={4} className="reveal">
                    <div className="testimonial-card glass-panel p-5 h-100 rounded-5 hover-lift">
                       <LuQuote size={40} className="text-gold opacity-25 mb-4" />
                       <p className="text-light fs-5 mb-4 font-italic fw-light opacity-75">"{t.quote}"</p>
                       <div className="d-flex align-items-center gap-3">
                          <div className="avatar bg-gold text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>{t.name[0]}</div>
                          <div>
                             <h6 className="text-white mb-0">{t.name}</h6>
                             <p className="smallest text-gold mb-0">{t.role}</p>
                          </div>
                       </div>
                    </div>
                  </Col>
                ))}
            </Row>
         </Container>
      </section>

      {/* Newsletter / Join the Nexus */}
      <section className="newsletter-nexus py-5 bg-gradient-gold-dark text-center">
         <Container className="py-5 reveal">
            <div className="glass-panel p-5 rounded-5 border-gold border-opacity-10 shadow-lg position-relative overflow-hidden">
               <div className="glow-effect-nexus"></div>
               <LuMail size={50} className="text-gold mb-4 animate-pulse" />
               <h2 className="display-5 text-white fw-bold mb-3">Join our Community</h2>
               <p className="text-light opacity-100 mb-5 fs-5">Sign up for new products and updates.</p>
               <div className="d-flex flex-column flex-md-row gap-3 justify-content-center max-width-600 mx-auto">
                  <input type="email" placeholder="Your best email address..." className="newsletter-input flex-grow-1" />
                  <Button className="btn btn-primary px-5 py-3 rounded-pill shadow-lg">SUBSCRIBE NOW</Button>
               </div>
            </div>
         </Container>
      </section>

      <style>{`
        .hero-background-gradient-dark {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.1), transparent 70%),
                      radial-gradient(circle at 20% 80%, rgba(0, 242, 255, 0.05), transparent 50%);
          pointer-events: none;
        }
        .hero-section {
            background: #080706;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hero-image-glow-v2 {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 80%; height: 80%;
            background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
            z-index: -1;
        }
        .fw-900 { font-weight: 900; }
        .bg-charcoal-light { background-color: #0c0a09; }
        
        .benchmark-card {
            background: rgba(255,255,255,0.02);
            transition: all 0.4s ease;
        }
        .benchmark-card:hover {
            background: rgba(212,175,55,0.05);
            border-color: rgba(212,175,55,0.2) !important;
        }
        
        .story-image-hull {
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .btn-outline-gold {
            border: 1px solid var(--pvr-gold);
            color: var(--pvr-gold);
            transition: all 0.3s ease;
        }
        .btn-outline-gold:hover {
            background: var(--pvr-gold);
            color: black;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }
        
        .bg-gradient-gold-dark {
            background: linear-gradient(to bottom, #080706, #0c0a09);
        }
        
        .newsletter-input {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50px;
            padding: 1rem 2rem;
            color: white;
            outline: none;
            transition: all 0.3s ease;
        }
        .newsletter-input:focus {
            border-color: var(--pvr-gold);
            background: rgba(255,255,255,0.1);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }
        
        .max-width-600 { max-width: 600px; }
        
        .glow-effect-nexus {
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
            z-index: 1;
            pointer-events: none;
        }
        
        .animate-pulse {
            animation: pulse-gold 2s infinite;
        }
        @keyframes pulse-gold {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Home;
