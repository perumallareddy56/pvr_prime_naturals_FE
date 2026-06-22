import React, { useContext, useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col, Form, ProgressBar } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  LuTrash2, 
  LuPhone, 
  LuTriangleAlert, 
  LuCreditCard, 
  LuWallet, 
  LuShieldCheck,
  LuShoppingBag,
  LuChevronRight,
  LuPlus,
  LuMinus,
  LuPackage,
  LuTruck,
  LuHistory,
  LuUser,
  LuSmartphone
} from 'react-icons/lu';
import useReveal from '../hooks/useReveal';
 
const RAZORPAY_KEY = "rzp_test_SbhMcQGUAQtBBx";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, fetchCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); 

  useReveal();

  useEffect(() => {
    if (currentUser) {
      api.get('/users/profile')
        .then(res => setProfile(res.data))
        .catch(err => console.error("Error fetching profile", err));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="bg-charcoal min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <LuUser className="text-gold opacity-25 mb-4" size={80} />
        <h2 className="text-white fw-bold mb-3">Sign In Required</h2>
        <p className="text-muted mb-4">Please sign in to access your shopping cart</p>
        <Button as={Link} to="/login" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium">
          SIGN IN TO CHECKOUT
        </Button>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!profile?.address) {
      toast.warning("Shipping address required. Please update your profile.");
      navigate('/profile');
      return;
    }
 
    if (paymentMethod === 'COD') {
      setPlacing(true);
      try {
        await api.post(`/orders/place?paymentId=COD&paymentMethod=COD`);
        await fetchCart();
        api.post('/live/pulse', { message: '⭐ Someone just placed a new order!', type: 'PURCHASE' });
        toast.success("Order placed successfully!");
        navigate('/orders');
      } catch (e) {
        toast.error('Order placement failed. Please try again.');
      } finally {
        setPlacing(false);
      }
    } else {
      // Razorpay Flow
      try {
        setPlacing(true);
        // 1. Create Razorpay Order on Backend
        const { data: orderData } = await api.post('/orders/payment/create', {
          amount: cart.total
        });
 
        const options = {
          key: RAZORPAY_KEY,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PVR Prime Naturals",
          description: "Premium Spice Purchase",
          order_id: orderData.id,
          handler: async (response) => {
            try {
              // 2. Place Final Order
              await api.post(`/orders/place?paymentId=${response.razorpay_payment_id}&paymentMethod=${paymentMethod}`);
              await fetchCart();
              api.post('/live/pulse', { message: '⭐ Someone just placed a new order!', type: 'PURCHASE' });
              toast.success("Payment successful! Order placed.");
              navigate('/orders');
            } catch (err) {
              console.error("Order placement error:", err);
              toast.error("Payment successful but order registration failed. Please contact support.");
              setPlacing(false);
            }
          },
          prefill: {
            email: currentUser.email,
            contact: profile.phoneNumber || ""
          },
          theme: {
            color: "#D4AF37"
          },
          modal: {
            ondismiss: function() {
              setPlacing(false);
            }
          }
        };
 
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (e) {
        console.error('RAZORPAY INITIALIZATION ERROR:', e);
        if (e.response) {
            console.error('SERVER ERROR DATA:', JSON.stringify(e.response.data));
        }
        const errorMsg = e.response?.data || e.message || 'Could not initialize payment';
        toast.error(`${errorMsg}. Please try again.`);
        setPlacing(false);
      }
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-charcoal min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <LuShoppingBag className="text-gold opacity-10 mb-4" size={100} />
        <h2 className="text-white fw-bold mb-3">Your Cart is Empty</h2>
        <p className="text-muted mb-5">Discover our premium range of hand-picked spices</p>
        <Button as={Link} to="/products" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium">
          EXPLORE CATALOG
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-page min-vh-100 py-5 bg-charcoal">
      <Container className="reveal mt-4">
        <div className="mb-5">
           <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Your Selection</span>
           <h2 className="text-white fw-bold display-5 mb-0">Shopping Cart</h2>
           <p className="text-muted small">You have {cart.items.length} items in your cart</p>
        </div>

        <Row className="g-5">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cart.items.map((item) => (
                <div key={item.id} className="glass-panel rounded-4 p-3 ps-4 pe-4 d-flex align-items-center justify-content-between border border-white border-opacity-5 shadow-premium hvr-lift" style={{ background: 'var(--pvr-charcoal-light)' }}>
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="position-relative me-4">
                      <img 
                        src={item.productImageUrl || '/assets/products/chilli.png'} 
                        alt={item.productName} 
                        className="rounded-4 border border-white border-opacity-10 shadow-lg"
                        style={{ width: '90px', height: '90px', objectFit: 'cover' }} 
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-gold opacity-10 rounded-4 pointer-events-none"></div>
                    </div>
                    <div>
                      <div className="text-gold smallest fw-bold text-uppercase mb-1 letter-spacing-1">Item #{item.id.toString().padStart(5, '0')}</div>
                      <div className="fw-bold text-white h5 mb-1">{item.productName}</div>
                      <div className="text-muted smallest text-uppercase opacity-50">Natural & Pure</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-4 gap-xl-5 flex-wrap justify-content-end">
                    <div className="text-center" style={{ minWidth: '90px' }}>
                      <div className="text-muted smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-50">Price</div>
                      <div className="text-white fw-bold">₹{item.price.toFixed(2)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-muted smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-50">Quantity</div>
                      <div className="d-inline-flex align-items-center bg-charcoal rounded-pill border border-white border-opacity-10 p-1">
                        <Button 
                          variant="link" 
                          className="text-gold p-1 border-0 shadow-none hvr-grow"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <LuMinus size={14} />
                        </Button>
                        <span className="px-3 fw-bold text-white smallest" style={{ minWidth: '40px' }}>
                          {item.quantity}
                        </span>
                        <Button 
                          variant="link" 
                          className="text-gold p-1 border-0 shadow-none hvr-grow"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <LuPlus size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center" style={{ minWidth: '100px' }}>
                      <div className="text-muted smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-50">Total</div>
                      <div className="text-gold fw-bold">₹{item.subTotal.toFixed(2)}</div>
                    </div>

                    <div className="ps-2">
                      <Button 
                        variant="link" 
                        className="text-danger p-2 border-0 shadow-none hvr-grow bg-danger bg-opacity-10 rounded-circle" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <LuTrash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-5 p-4 rounded-4 border border-white border-opacity-5 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="d-flex align-items-center gap-3">
                   <div className="rounded-circle bg-charcoal p-3 border border-white border-opacity-5">
                      <LuTruck className="text-gold" size={24} />
                   </div>
                   <div>
                      <div className="text-white fw-bold small">FREE SHIPPING UNLOCKED</div>
                      <div className="text-white smallest text-uppercase opacity-75">FREE DELIVERY ON ALL ORDERS</div>
                   </div>
                </div>
                <Button as={Link} to="/products" variant="link" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1">
                   <LuPlus className="me-2" /> ADD MORE ITEMS
                </Button>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="glass-panel border-0 shadow-premium sticky-top" style={{ background: 'var(--pvr-charcoal-light)', top: '100px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold text-white mb-4 text-uppercase letter-spacing-2 smallest">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Subtotal</span>
                  <span className="text-white small fw-bold">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-muted small">Shipping</span>
                  <span className="text-success small fw-bold text-uppercase">Free</span>
                </div>
                
                <hr className="border-white border-opacity-10 my-4" />
                
                <div className="d-flex justify-content-between mb-5">
                  <span className="text-white fw-bold h5">Total</span>
                  <span className="text-gold fw-bold h4 mb-0">₹{cart.total.toFixed(2)}</span>
                </div>

                {profile && (
                  <div className="mb-4 p-4 rounded-4 border border-white border-opacity-5 shadow-inner" style={{ background: 'var(--pvr-charcoal-off)' }}>
                      <div className="text-gold smallest fw-bold text-uppercase mb-3 letter-spacing-1 d-flex justify-content-between">
                         <span>Shipping Address</span>
                         <Link to="/profile" className="text-gold opacity-50"><LuPencil size={12} /></Link>
                      </div>
                      {profile.address ? (
                        <div className="text-white">
                          <div className="fw-bold small mb-2">{profile.name}</div>
                          <div className="text-muted smallest mb-2 line-height-sm">{profile.address}</div>
                          <div className="smallest opacity-50"><LuPhone size={10} className="me-2" /> {profile.phoneNumber}</div>
                        </div>
                      ) : (
                        <div className="text-danger smallest fw-bold">
                          <LuTriangleAlert className="me-2" />
                          PLEASE ADD AN ADDRESS
                        </div>
                      )}
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-gold smallest fw-bold text-uppercase mb-3 letter-spacing-1">Payment Method</div>
                  <div className={`p-3 rounded-4 border mb-2 transition-all cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-gold bg-gold bg-opacity-5' : 'border-white border-opacity-5 bg-charcoal'}`}
                       onClick={() => setPaymentMethod('ONLINE')}>
                    <Form.Check 
                      type="radio"
                      id="payment-online"
                      label={<span className="text-white smallest fw-bold"><LuCreditCard className="me-2 text-gold" /> SECURE ONLINE PAYMENT</span>}
                      name="paymentOption"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="custom-radio-gold"
                    />
                  </div>
                  <div className={`p-3 rounded-4 border mb-2 transition-all cursor-pointer ${paymentMethod === 'UPI' ? 'border-gold bg-gold bg-opacity-5' : 'border-white border-opacity-5 bg-charcoal'}`}
                       onClick={() => setPaymentMethod('UPI')}>
                    <Form.Check 
                      type="radio"
                      id="payment-upi"
                      label={<span className="text-white smallest fw-bold"><LuSmartphone className="me-2 text-gold" /> UPI PAYMENT (BHIM/GPay/PhonePe)</span>}
                      name="paymentOption"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="custom-radio-gold"
                    />
                  </div>
                  <div className={`p-3 rounded-4 border mb-2 transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-gold bg-gold bg-opacity-5' : 'border-white border-opacity-5 bg-charcoal'}`}
                       onClick={() => setPaymentMethod('COD')}>
                    <Form.Check 
                      type="radio"
                      id="payment-cod"
                      label={<span className="text-white smallest fw-bold"><LuWallet className="me-2 text-gold" /> CASH ON DELIVERY</span>}
                      name="paymentOption"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="custom-radio-gold"
                    />
                  </div>
                </div>

                <Button 
                  className="w-100 rounded-pill py-3 fw-bold mt-2 shadow-premium shimmer" 
                  variant="warning"
                  onClick={handleCheckout} 
                  disabled={placing || !profile?.address}
                >
                  {placing ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <LuShieldCheck className="me-2" /> PROCEED TO CHECKOUT
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-3 text-muted smallest letter-spacing-1">
                   <LuPackage className="me-2" /> 100% SECURE TRANSACTION
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .bg-gold { background-color: var(--pvr-gold); }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .hvr-lift { transition: transform 0.3s ease; }
        .hvr-lift:hover { transform: translateY(-5px); }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.15); }
        .line-height-sm { line-height: 1.4; }
        .cursor-pointer { cursor: pointer; }
        
        .custom-radio-gold .form-check-input:checked {
            background-color: var(--pvr-gold);
            border-color: var(--pvr-gold);
        }
        .custom-radio-gold .form-check-input {
            background-color: transparent;
            border-color: rgba(255,255,255,0.2);
            margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

const LuPencil = ({ size }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default Cart;
