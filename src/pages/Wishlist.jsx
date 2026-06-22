import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { LuHeart, LuShoppingBag, LuChevronRight, LuPlus } from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  useReveal();

  return (
    <div className="wishlist-page min-vh-100 py-5 bg-charcoal">
      <Container className="mt-4">
        <div className="mb-5 text-center reveal">
           <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Saved Items</span>
           <h2 className="text-white fw-bold display-5 mb-0">Your Wishlist</h2>
           <div className="title-underline mx-auto mt-3"></div>
           <p className="text-muted mt-3 small">You have {wishlist.length} items in your wishlist</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-5 reveal">
            <div className="mb-4 text-gold opacity-10 d-flex justify-content-center hvr-bounce" style={{ fontSize: '6rem' }}>
              <LuHeart />
            </div>
            <h4 className="text-white fw-bold mb-3">Your Wishlist is Empty</h4>
            <p className="text-muted mb-5">You haven't added any products to your wishlist yet.</p>
            <Button as={Link} to="/products" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium">
              CONTINUE SHOPPING <LuChevronRight className="ms-2" />
            </Button>
          </div>
        ) : (
          <Row className="g-4 reveal">
            {wishlist.map((item, index) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="glass-panel border-0 h-100 shadow-premium hvr-lift overflow-hidden" style={{ background: 'var(--pvr-charcoal-light)', transitionDelay: `${index * 0.05}s` }}>
                  <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                    <Card.Img
                      variant="top"
                      src={item.imageUrl || '/assets/products/dry_fruits.png'}
                      className="w-100 h-100 object-fit-cover transition-slow"
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-10"></div>
                    <Button 
                      className="position-absolute top-0 end-0 m-3 border-0 bg-charcoal bg-opacity-50 p-2 rounded-circle shadow-lg hvr-grow"
                      onClick={() => toggleWishlist(item)}
                    >
                      <LuHeart className="text-danger" fill="currentColor" size={20} />
                    </Button>
                  </div>
                  <Card.Body className="d-flex flex-column p-4 bg-dark bg-opacity-25">
                    <div className="text-gold smallest fw-bold text-uppercase mb-1 letter-spacing-1">Premium Choice</div>
                    <Card.Title className="fw-bold text-white mb-2 small">{item.name}</Card.Title>
                    <Card.Text className="text-muted smallest opacity-75 mb-4 line-height-sm">
                      {item.description?.substring(0, 70)}...
                    </Card.Text>
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-5">
                      <span className="h6 fw-bold text-gold mb-0">₹{item.price.toFixed(2)}</span>
                      <Button
                        variant="warning"
                        className="rounded-pill px-3 py-2 smallest fw-bold shadow-premium shimmer"
                        onClick={() => addToCart(item.id, 1)}
                      >
                        <LuPlus className="me-1" size={12} /> CART
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .hvr-lift { transition: transform 0.3s ease; }
        .hvr-lift:hover { transform: translateY(-8px); }
        .hvr-lift:hover .transition-slow { transform: scale(1.1); }
        .transition-slow { transition: all 0.5s ease; }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.15); }
        .line-height-sm { line-height: 1.4; }
        .hvr-bounce:hover { transform: scale(1.1); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default Wishlist;
