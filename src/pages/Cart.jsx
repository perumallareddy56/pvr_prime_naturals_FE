import React, { useContext, useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Form } from 'react-bootstrap';
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
  LuPlus,
  LuMinus,
  LuPackage,
  LuTruck,
  LuUser,
  LuSmartphone,
  LuPencil
} from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

// const RAZORPAY_KEY = "rzp_test_SbhMcQGUAQtBBx";
const RAZORPAY_KEY = "rzp_test_T89iO66NMncEzs";

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
      // Razorpay Flow — handles both ONLINE and UPI.
      // Razorpay's modal natively shows UPI/GPay/PhonePe options;
      // the selected paymentMethod string is forwarded to the backend.
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
          // Pre-select UPI tab in Razorpay modal when user chose UPI
          ...(paymentMethod === 'UPI' && { method: { upi: true } }),
          handler: async (response) => {
            try {
              // 2. Place Final Order — paymentMethod correctly sent to backend
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
        {/* Luxury Page Header */}
        <div className="mb-5 border-bottom border-white border-opacity-5 pb-4 d-flex justify-content-between align-items-end flex-wrap gap-3">
          <div>
            <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Your Selection</span>
            <h2 className="text-white fw-bold display-5 mb-0 mt-1 letter-spacing-1">Shopping Cart</h2>
          </div>
          <div className="bg-white-opacity-5 border border-white border-opacity-10 px-4 py-2 rounded-pill shadow-premium">
            <span className="text-white-50 smallest text-uppercase letter-spacing-1">Total Items: </span>
            <span className="text-gold fw-bold ms-1">{cart.items.length}</span>
          </div>
        </div>

        <Row className="g-5">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cart.items.map((item) => (
                <div key={item.id} className="premium-glass-card rounded-4 p-4 d-flex align-items-center justify-content-between border border-white border-opacity-5 shadow-premium position-relative overflow-hidden hvr-premium-lift" style={{ background: 'linear-gradient(135deg, rgba(28, 25, 23, 0.7) 0%, rgba(12, 10, 9, 0.95) 100%)' }}>
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="position-relative me-4">
                      <img
                        src={item.productImageUrl || '/assets/products/chilli.png'}
                        alt={item.productName}
                        className="rounded-4 border border-white border-opacity-10 shadow-lg"
                        style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-gold-opacity-10 rounded-4 pointer-events-none"></div>
                    </div>
                    <div>
                      <div className="text-gold smallest fw-bold text-uppercase mb-1 letter-spacing-1 bg-gold-opacity-10 px-2 py-0.5 rounded d-inline-block">Item #{item.id.toString().padStart(5, '0')}</div>
                      <div className="fw-bold text-white h5 mb-1 mt-1">{item.productName}</div>
                      <div className="text-white-50 smallest text-uppercase letter-spacing-1 opacity-75">Natural & Pure</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-4 gap-xl-5 flex-wrap justify-content-end">
                    <div className="text-center" style={{ minWidth: '90px' }}>
                      <div className="text-white-50 smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-75">Price</div>
                      <div className="text-white fw-bold">₹{item.price.toFixed(2)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-white-50 smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-75">Quantity</div>
                      <div className="d-inline-flex align-items-center bg-charcoal-off rounded-pill border border-white border-opacity-5 p-1 shadow-inner">
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
                      <div className="text-white-50 smallest text-uppercase letter-spacing-1 mb-1 fw-bold opacity-75">Total</div>
                      <div className="text-gold fw-bold h6 mb-0">₹{item.subTotal.toFixed(2)}</div>
                    </div>

                    <div className="ps-2">
                      <Button
                        variant="link"
                        className="text-danger p-2 border-0 shadow-none hvr-grow bg-danger bg-opacity-10 rounded-circle delete-btn-hover"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <LuTrash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Glowing Unlocked Free Shipping Banner */}
            <div className="mt-5 p-4 rounded-4 border border-gold border-opacity-20 d-flex align-items-center justify-content-between position-relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 100%)', boxShadow: '0 0 20px rgba(212, 175, 55, 0.04)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-gold bg-opacity-10 p-3 border border-gold border-opacity-20 shadow-premium">
                  <LuTruck className="text-gold" size={24} />
                </div>
                <div>
                  <div className="text-white fw-bold small letter-spacing-1">FREE SHIPPING UNLOCKED</div>
                  <div className="text-white-50 smallest text-uppercase opacity-75 mt-0.5">Complimentary Delivery Applied to Your Order</div>
                </div>
              </div>
              <Button as={Link} to="/products" variant="link" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1 hvr-grow">
                <LuPlus className="me-2" /> ADD MORE ITEMS
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="glass-panel border border-white border-opacity-5 shadow-premium sticky-top rounded-4" style={{ background: 'linear-gradient(135deg, rgba(32, 28, 26, 0.8) 0%, rgba(20, 17, 15, 0.95) 100%)', top: '100px' }}>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h5 className="fw-bold text-white mb-1 text-uppercase letter-spacing-2 smallest">Order Summary</h5>
                  <div className="bg-gold" style={{ height: '2px', width: '35px', borderRadius: '1px' }}></div>
                </div>

                <div className="d-flex justify-content-between mb-3 mt-4">
                  <span className="text-white-50 small">Subtotal</span>
                  <span className="text-white small fw-bold">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-white-50 small">Shipping</span>
                  <span className="text-success small fw-bold text-uppercase letter-spacing-1">Free</span>
                </div>

                <hr className="border-white border-opacity-10 my-4" />

                <div className="d-flex justify-content-between mb-5 align-items-center">
                  <span className="text-white fw-bold h5 mb-0">Total Amount</span>
                  <span className="text-gold fw-bold h4 mb-0 letter-spacing-1">₹{cart.total.toFixed(2)}</span>
                </div>

                {profile && (
                  <div className="mb-4 p-4 rounded-4 border border-white border-opacity-5 shadow-inner" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                    <div className="text-gold smallest fw-bold text-uppercase mb-3 letter-spacing-1 d-flex justify-content-between align-items-center">
                      <span>Shipping Address</span>
                      <Link to="/profile" className="text-gold opacity-50 hvr-grow"><LuPencil size={12} /></Link>
                    </div>
                    {profile.address ? (
                      <div className="text-white">
                        <div className="fw-bold small mb-2">{profile.name || currentUser.email}</div>
                        <div className="text-white-50 smallest mb-2 line-height-sm">{profile.address}</div>
                        <div className="smallest opacity-50 d-flex align-items-center"><LuPhone size={10} className="me-2 text-gold" /> {profile.phoneNumber}</div>
                      </div>
                    ) : (
                      <div className="text-danger smallest fw-bold d-flex align-items-center">
                        <LuTriangleAlert className="me-2" />
                        PLEASE ADD AN ADDRESS
                      </div>
                    )}
                  </div>
                )}

                {/* Luxury Custom Payment Options */}
                <div className="mb-4">
                  <div className="text-gold smallest fw-bold text-uppercase mb-3 letter-spacing-1">Payment Method</div>
                  
                  <div 
                    className={`payment-option-card p-3 rounded-4 border mb-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'ONLINE' ? 'active-gold' : 'inactive-dark'}`}
                    onClick={() => setPaymentMethod('ONLINE')}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`payment-icon-wrapper rounded-3 p-2 d-flex ${paymentMethod === 'ONLINE' ? 'bg-gold-opacity-20 text-gold' : 'bg-white-opacity-5 text-white-50'}`}>
                        <LuCreditCard size={18} />
                      </div>
                      <span className="text-white smallest fw-bold text-uppercase letter-spacing-1">Secure Online Payment</span>
                    </div>
                    <div className={`radio-dot ${paymentMethod === 'ONLINE' ? 'selected' : ''}`}></div>
                  </div>

                  <div 
                    className={`payment-option-card p-3 rounded-4 border mb-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'UPI' ? 'active-gold' : 'inactive-dark'}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`payment-icon-wrapper rounded-3 p-2 d-flex ${paymentMethod === 'UPI' ? 'bg-gold-opacity-20 text-gold' : 'bg-white-opacity-5 text-white-50'}`}>
                        <LuSmartphone size={18} />
                      </div>
                      <span className="text-white smallest fw-bold text-uppercase letter-spacing-1">UPI (GPay / PhonePe / BHIM)</span>
                    </div>
                    <div className={`radio-dot ${paymentMethod === 'UPI' ? 'selected' : ''}`}></div>
                  </div>

                  <div 
                    className={`payment-option-card p-3 rounded-4 border mb-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'COD' ? 'active-gold' : 'inactive-dark'}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`payment-icon-wrapper rounded-3 p-2 d-flex ${paymentMethod === 'COD' ? 'bg-gold-opacity-20 text-gold' : 'bg-white-opacity-5 text-white-50'}`}>
                        <LuWallet size={18} />
                      </div>
                      <span className="text-white smallest fw-bold text-uppercase letter-spacing-1">Cash On Delivery (COD)</span>
                    </div>
                    <div className={`radio-dot ${paymentMethod === 'COD' ? 'selected' : ''}`}></div>
                  </div>
                </div>

                <Button
                  className="w-100 rounded-pill py-3 fw-bold mt-2 shadow-premium btn-premium-gold"
                  onClick={handleCheckout}
                  disabled={placing || !profile?.address}
                >
                  {placing ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <LuShieldCheck size={18} /> PROCEED TO CHECKOUT
                    </span>
                  )}
                </Button>

                <div className="text-center mt-4 text-white-50 smallest letter-spacing-1 opacity-50 d-flex align-items-center justify-content-center">
                  <LuShieldCheck className="me-2 text-gold" size={14} /> 100% SECURE SSL TRANSACTION
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .bg-charcoal-off { background-color: #1c1917; }
        .bg-gold { background-color: var(--pvr-gold); }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .text-white-50 {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .bg-gold-opacity-10 {
          background-color: rgba(212, 175, 55, 0.1) !important;
        }
        .bg-gold-opacity-20 {
          background-color: rgba(212, 175, 55, 0.25) !important;
        }
        .bg-white-opacity-5 {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        /* Premium hover transitions */
        .hvr-premium-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .hvr-premium-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 1px rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.2) !important;
        }
        
        .hvr-grow { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .hvr-grow:hover { transform: scale(1.05); }
        
        .line-height-sm { line-height: 1.4; }
        .cursor-pointer { cursor: pointer; }
        
        /* Custom Payment Option Cards */
        .payment-option-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .payment-option-card.active-gold {
          border-color: var(--pvr-gold) !important;
          background: rgba(212, 175, 55, 0.06);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.05);
        }
        .payment-option-card.inactive-dark {
          border-color: rgba(255, 255, 255, 0.05) !important;
          background: rgba(25, 22, 20, 0.4);
        }
        .payment-option-card:hover {
          border-color: rgba(212, 175, 55, 0.4) !important;
          transform: translateX(3px);
        }
        
        .payment-icon-wrapper {
          transition: all 0.3s ease;
        }
        
        /* Custom Premium Radio Dot */
        .radio-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          position: relative;
          transition: all 0.3s ease;
        }
        .radio-dot.selected {
          border-color: var(--pvr-gold);
          background-color: var(--pvr-gold);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }
        .radio-dot.selected::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #0c0a09;
        }
        
        /* Premium Luxury Action Button */
        .btn-premium-gold {
          background: linear-gradient(135deg, #d4af37 0%, #b28d26 100%) !important;
          border: none !important;
          color: #0c0a09 !important;
          text-shadow: 0 1px 1px rgba(255,255,255,0.2);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .btn-premium-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #f3cf58 0%, #d4af37 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }
        .btn-premium-gold:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-premium-gold:disabled {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.2) !important;
          box-shadow: none;
        }
        
        /* Soft Delete Button hover transition */
        .delete-btn-hover {
          transition: all 0.3s ease;
        }
        .delete-btn-hover:hover {
          background-color: #dc3545 !important;
          color: white !important;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Cart;
