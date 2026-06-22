import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Breadcrumb, Form } from 'react-bootstrap';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import { 
  LuStar, 
  LuHeart, 
  LuShoppingBag, 
  LuCircleCheck, 
  LuTrash2, 
  LuChevronRight,
  LuSparkles,
  LuShieldCheck,
  LuArrowLeft,
  LuMessageSquare,
  LuSend,
  LuUser
} from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { currentUser, isAdmin } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useReveal([loading]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
        
        if (prodRes.data.subCategory?.productType?.name) {
          const relatedRes = await api.get('/products', { 
            params: { type: prodRes.data.subCategory.productType.name } 
          });
          setRelatedProducts(relatedRes.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Please login to leave a review");
    try {
      const res = await api.post(`/reviews/product/${id}`, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success("Thank you for your review!");
    } catch (e) {
      toast.error("Could not submit review.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted.");
    } catch (e) {
      toast.error("Error deleting review.");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, 1);
      api.post('/live/pulse', { 
        message: `✨ Someone is exploring our premium ${product.name}!`, 
        type: 'DISCOVERY' 
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-charcoal min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-gold" role="status"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-charcoal min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <LuSparkles className="text-gold opacity-10 mb-4" size={100} />
        <h2 className="text-white fw-bold mb-3">Product Not Found</h2>
        <p className="text-muted mb-5">The requested product information is no longer available.</p>
        <Button as={Link} to="/products" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium">
          BACK TO SHOP
        </Button>
      </div>
    );
  }

  return (
    <div className="product-detail-page bg-charcoal min-vh-100 py-5">
      <Container className="reveal mt-4">
        <Link to="/products" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1 mb-4 d-inline-flex align-items-center hvr-grow">
          <LuArrowLeft className="me-2" /> BACK TO PRODUCTS
        </Link>

        <Row className="g-5 mt-2">
          <Col lg={6}>
            <div className="position-relative p-2 rounded-5 overflow-hidden shadow-premium" style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'var(--pvr-charcoal-light)' }}>
              <img 
                src={product.imageUrl || '/assets/products/coffee.png'} 
                alt={product.name}
                className="img-fluid w-100 rounded-5 shadow-inner transition-slow grayscale-hover"
                style={{ objectFit: 'cover', height: '550px' }}
              />
              <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark">
                  <Badge bg="dark" className="border border-gold border-opacity-25 text-gold px-3 py-1 rounded-pill smallest fw-bold">SKU-{product.id.toString().padStart(5, '0')}</Badge>
              </div>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="ps-lg-4">
              <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Product Details</span>
              <h1 className="text-white fw-bold display-4 mt-2 mb-3">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-4 mb-4">
                <span className="h1 text-gold fw-bold mb-0">₹{product.price.toFixed(2)}</span>
                <div className="glass-panel px-3 py-1 rounded-pill border border-white border-opacity-10 d-flex align-items-center gap-2">
                   <LuShieldCheck className="text-success" size={14} />
                   <span className="text-white smallest fw-bold letter-spacing-1">100% PURE & NATURAL</span>
                </div>
              </div>

              <p className="text-white mb-5 fs-5 line-height-md">{product.description}</p>

              <div className="d-flex gap-3 mb-5">
                <Button 
                  variant="warning"
                  className="rounded-pill px-5 py-3 fw-bold shadow-premium flex-grow-1 shimmer"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                >
                   <LuShoppingBag className="me-2" /> {product.stockQuantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </Button>
                <Button 
                  variant="link" 
                  className={`glass-panel p-3 rounded-circle border border-white border-opacity-10 shadow-premium hvr-grow ${isInWishlist(product.id) ? 'text-danger' : 'text-white opacity-50'}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <LuHeart fill={isInWishlist(product.id) ? 'currentColor' : 'none'} size={24} />
                </Button>
              </div>

              {/* Artisanal Heritage Processing Card */}
              <div className="p-4 rounded-5 border border-white border-opacity-5 reveal shadow-premium mt-5" style={{ background: 'var(--pvr-charcoal-light)' }}>
                  <h6 className="text-gold fw-bold text-uppercase letter-spacing-2 smallest mb-4">How Our Spices Are Made</h6>
                  <div className="d-flex flex-column gap-3">
                      {[1, 2, 3, 4].map((step) => {
                          const steps = ["Traditional Small-batch Processing", "Sun-dried to preserve aroma", "Stone-ground for natural flavor", "Double-sealed for long-lasting freshness"];
                          return (
                            <div key={step} className="d-flex align-items-center gap-3">
                               <LuCircleCheck className="text-success opacity-50" size={16} />
                               <span className="text-white opacity-75 small fw-bold">{steps[step-1]}</span>
                            </div>
                          );
                      })}
                  </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Intelligence Feed (Reviews) */}
        <Row className="mt-5 pt-5 g-5">
          <Col lg={7}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <LuMessageSquare className="text-gold" size={24} />
                <h3 className="text-white fw-bold mb-0">Customer Reviews <span className="opacity-25 fs-5">({reviews.length})</span></h3>
            </div>
            
            {reviews.length === 0 ? (
              <div className="glass-panel p-5 rounded-4 text-center border border-white border-opacity-5 opacity-50 mt-4">
                <p className="text-muted smallest text-uppercase mb-0">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="review-list mt-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-4 mb-4 border border-white border-opacity-5 shadow-inner" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-charcoal p-1 border border-white border-opacity-10"><LuUser className="text-gold" size={14} /></div>
                          <div className="text-white fw-bold small">{rev.user?.name || 'Authorized User'}</div>
                      </div>
                      <div className="text-gold d-flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <LuStar key={i} size={12} fill={i < rev.rating ? 'currentColor' : 'none'} className={i >= rev.rating ? 'opacity-25' : ''} />
                        ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between gap-3">
                       <p className="text-muted small italic flex-grow-1 opacity-75">"{rev.comment}"</p>
                       {isAdmin && (
                         <Button variant="link" className="text-danger p-0 hvr-grow" onClick={() => handleReviewDelete(rev.id)}>
                            <LuTrash2 size={16} />
                         </Button>
                       )}
                    </div>
                    <div className="mt-3 text-gold smallest opacity-25 fw-bold text-uppercase">{new Date(rev.createdAt).toLocaleDateString()} | VERIFIED REVIEW</div>
                  </div>
                ))}
              </div>
            )}
          </Col>
          
          <Col lg={5}>
            <div className="glass-panel p-4 p-lg-5 rounded-5 border border-white border-opacity-5 reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                  <LuSend className="text-gold" size={20} />
                  <h5 className="text-white fw-bold mb-0 text-uppercase letter-spacing-1 small">Write a Review</h5>
              </div>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Your Rating</Form.Label>
                  <Form.Select 
                    className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 shadow-inner focus-gold smallest" 
                    value={reviewForm.rating} 
                    onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  >
                    <option value="5">Excellent [5]</option>
                    <option value="4">Very Good [4]</option>
                    <option value="3">Good [3]</option>
                    <option value="2">Fair [2]</option>
                    <option value="1">Poor [1]</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Your Review</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 shadow-inner focus-gold smallest" 
                    placeholder="Write your review here..."
                    required
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  />
                </Form.Group>
                <Button variant="warning" type="submit" className="w-100 rounded-pill py-3 fw-bold smallest shimmer shadow-premium" disabled={!currentUser}>
                  {currentUser ? 'SUBMIT REVIEW' : 'PLEASE LOGIN'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        {/* You Might Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-5 pt-5 reveal">
            <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <LuSparkles className="text-gold" size={20} /> YOU MIGHT ALSO LIKE
            </h4>
            <Row className="g-4">
              {relatedProducts.map(rp => (
                <Col key={rp.id} xs={12} sm={6} md={3}>
                  <ProductCard product={rp} addToCart={(prod) => addToCart(prod.id, 1)} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .bg-gradient-dark { background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%); }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .line-height-md { line-height: 1.8; }
        .transition-slow { transition: all 0.5s ease; }
        .grayscale-hover:hover { filter: grayscale(0.5) contrast(1.1); }
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

export default ProductDetail;
