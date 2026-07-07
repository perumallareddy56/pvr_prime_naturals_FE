import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import { toast } from 'react-toastify';
import { 
  LuReceipt, 
  LuBox, 
  LuList, 
  LuCreditCard, 
  LuWallet, 
  LuMapPin, 
  LuShieldCheck,
  LuSmartphone
} from 'react-icons/lu';
import { useWebSocket } from '../context/WebSocketContext';
import Pagination from '../components/Pagination';
import OrderTracker from '../components/OrderTracker';
import DeliveryMap from '../components/DeliveryMap';

const OrderCard = ({ order, getStatusColor, getStatusBadge, handleCancelOrder }) => {
  const [showMap, setShowMap] = useState(false);
  
  return (
    <Card key={order.id} 
          className="mb-5 border-0 rounded-4 overflow-hidden reveal glass-panel"
          style={{ 
            background: 'var(--pvr-charcoal-light)',
            borderLeft: `4px solid ${getStatusColor(order.status)}` 
          }}>
      <Card.Header className="border-0 py-4 px-4 border-bottom" style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Row className="align-items-center g-3 text-white">
          <Col md={4} lg={3}>
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle border border-warning border-opacity-20 shadow-sm text-gold" style={{ background: 'rgba(255,215,0,0.05)' }}>
                <LuBox size={24} />
              </div>
              <div>
                <div className="text-gold small fw-bold letter-spacing-2" style={{ fontSize: '0.65rem' }}>ORDER ID</div>
                <div className="h5 mb-0 fw-bold">#PVR-{order.id}</div>
              </div>
            </div>
          </Col>
          <Col md={3} lg={3}>
            <div>
              <div className="text-white small fw-bold letter-spacing-2" style={{ fontSize: '0.65rem' }}>ORDER DATE</div>
              <div className="fw-medium text-white opacity-75">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </Col>
          <Col md={3} lg={3}>
            <div className="d-flex align-items-center gap-2">
              <div className="text-white small fw-bold letter-spacing-2 me-2" style={{ fontSize: '0.65rem' }}>STATUS:</div>
              {getStatusBadge(order.status)}
            </div>
          </Col>
          <Col md={2} lg={3} className="text-md-end">
            <div className="h4 mb-0 fw-bold text-gold">₹{order.totalAmount.toFixed(2)}</div>
            <div className="text-white small text-uppercase letter-spacing-2 fw-bold" style={{ fontSize: '0.65rem' }}>Total Paid</div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="p-4 p-lg-5 text-white">
        <div className="mb-5 pb-4 border-bottom border-white border-opacity-10 d-flex justify-content-center w-100">
          <OrderTracker status={order.status} />
        </div>
        <Row className="g-5">
          <Col lg={7}>
            <h6 className="text-gold fw-bold text-uppercase mb-4 letter-spacing-2" style={{ fontSize: '0.8rem' }}>
              <LuList className="me-2" />Ordered Items
            </h6>
            <div className="order-items-container">
              {order.items.map(item => (
                <div key={item.id} className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-white border-opacity-10 last-child-border-0">
                  <div className="d-flex align-items-center">
                    <div className="cart-img-wrapper me-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <img 
                        src={item.productImageUrl || '/assets/products/turmeric.png'} 
                        alt={item.productName} 
                        className="rounded-3 shadow-sm"
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }} 
                      />
                      <span className="position-absolute translate-middle badge rounded-pill bg-gold text-dark shadow-sm" style={{ top: '0', left: '100%', fontSize: '0.7rem' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <div className="fw-bold fs-5">{item.productName}</div>
                      <div className="text-white small opacity-75">Artisanal Blend</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-gold">₹{item.priceAtPurchase.toFixed(2)}</div>
                    <div className="text-white small opacity-75">per unit</div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <div className="p-4 rounded-4 border border-white border-opacity-10 h-100" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h6 className="text-gold fw-bold text-uppercase mb-4 letter-spacing-2" style={{ fontSize: '0.8rem' }}>
                <LuBox className="me-2" />Payment & Delivery
              </h6>
              
              <div className="mb-4">
                <div className="small text-white mb-1 text-uppercase letter-spacing-2 fw-bold" style={{ fontSize: '0.7rem' }}>Payment Method</div>
                <div className="d-flex align-items-center">
                  {order.paymentMethod === 'COD' ? <LuWallet className="fs-4 me-3 text-gold" /> : (order.paymentMethod === 'UPI' ? <LuSmartphone className="fs-4 me-3 text-gold" /> : <LuCreditCard className="fs-4 me-3 text-gold" />)}
                  <div>
                     <div className="fw-bold">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : (order.paymentMethod === 'UPI' ? 'UPI Payment' : 'Online Payment')}</div>
                     <div className="text-white small opacity-75">Verified Secure</div>
                  </div>
                </div>
              </div>

              <div className="mb-4 border-top border-white border-opacity-10 pt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-white text-uppercase letter-spacing-2 fw-bold" style={{ fontSize: '0.7rem' }}>Delivery Tracking</div>
                  {(order.status === 'SHIPPED' || order.status === 'OUT_FOR_DELIVERY') && (
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none smallest fw-bold track-live-btn px-2 py-1 rounded-pill"
                      onClick={() => setShowMap(!showMap)}
                    >
                      {showMap ? 'CLOSE TRACKER' : 'TRACK MANIFEST LIVE'}
                    </Button>
                  )}
                </div>
                <div className="d-flex align-items-start mb-3">
                  <LuMapPin className="fs-4 me-3 text-gold" />
                  <div>
                    <div className="fw-bold">Gourmet Quality Checked</div>
                    <div className="text-white small opacity-75">ID: TRK-PVR-{order.id}</div>
                  </div>
                </div>
                
                {showMap && (
                  <div className="mt-4 reveal-in">
                    <DeliveryMap orderId={order.id} status={order.status} createdAt={order.createdAt} />
                  </div>
                )}
              </div>

              <div className="pt-3 border-top border-warning border-opacity-20 mt-4">
                 <div className="d-flex justify-content-between mb-2 small opacity-50">
                   <span>Subtotal</span>
                   <span>₹{order.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="d-flex justify-content-between mb-4 small opacity-50">
                   <span>Delivery Fee</span>
                   <span className="text-success fw-bold">FREE</span>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                   <span className="fw-bold">Amount Paid</span>
                   <span className="h4 mb-0 fw-bold text-gold">₹{order.totalAmount.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="border-top border-white border-opacity-10 py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <div className="small text-muted d-flex align-items-center">
          <LuShieldCheck className="text-success me-2" />
          Premium quality standards and hand-picked verification active.
        </div>
        {order.status === 'PLACED' && (
          <Button 
            variant="outline-danger" 
            className="rounded-pill px-4 py-2 smallest fw-bold letter-spacing-1 hvr-grow"
            onClick={() => handleCancelOrder(order.id)}
          >
            CANCEL ORDER
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { stompClient, connected } = useWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useReveal();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [currentUser, navigate]);

  // Real-time synchronization for order status changes
  useEffect(() => {
    if (connected && stompClient && currentUser) {
      const subscription = stompClient.subscribe(`/topic/orders/${currentUser.id}`, (message) => {
        // Refresh the list when a status change is detected
        fetchOrders();
      });
      return () => subscription.unsubscribe();
    }
  }, [connected, stompClient, currentUser]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/user');
      const activeOrders = res.data.filter(o => o.status === 'PLACED' || o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY');
      setOrders(activeOrders);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO ABORT THIS MANIFEST? This action is irreversible and restored items will return to inventory.")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success(`Manifest #${orderId} has been successfully aborted.`);
      fetchOrders();
    } catch (err) {
      toast.error("Protocol violation: Cancellation failed.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return '#cda434';
      case 'SHIPPED': return '#17a2b8';
      case 'DELIVERED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const isLive = connected && (status === 'PLACED' || status === 'SHIPPED');
    return (
      <Badge style={{ backgroundColor: color, border: 'none' }} className="px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2">
        {isLive && <div className="live-indicator-dot" style={{ width: '6px', height: '6px', background: 'white' }}></div>}
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <div className="orders-page bg-dark min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5 reveal">
          <span className="section-label">Your Journey</span>
          <h2 className="display-4 fw-bold text-white">Active Orders</h2>
          <p className="text-gold small fw-bold letter-spacing-2 mt-2">PREMIUM ARTISANAL SELECTIONS</p>
          <div className="d-inline-block px-4 py-2 rounded-pill border border-warning border-opacity-20 shadow-sm mt-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <span className="fw-bold text-gold">{orders.length}</span> <span className="text-white small letter-spacing-1 ms-2">ACTIVE ORDERS</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state-container reveal p-5 rounded-5 border border-warning-subtle text-center mt-5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="empty-icon display-1 mb-4 text-gold opacity-50"><LuReceipt size={80} className="mx-auto" /></div>
            <h3 className="text-white fw-bold mb-3">No Orders Yet</h3>
            <p className="text-muted mb-4 fs-5 mx-auto" style={{maxWidth: '600px'}}>
              Your gourmet spice journey hasn't started yet. Browse our premium collection 
              and place your first order today!
            </p>
            <Button as={Link} to="/products" className="btn btn-primary px-5 py-3 rounded-pill trending-glow">Start Shopping</Button>
          </div>
        ) : (
          <div className="order-list">
            {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                getStatusColor={getStatusColor} 
                getStatusBadge={getStatusBadge} 
                handleCancelOrder={handleCancelOrder} 
              />
            ))}
            <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(orders.length / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Container>
      <style>{`
        .bg-charcoal { background-color: var(--pvr-charcoal-off); }
        .bg-dark-soft { background-color: var(--pvr-charcoal-off); }
        .title-underline { width: 80px; height: 3px; background: var(--accent-gradient); border-radius: 2px; margin-top: 10px; margin-bottom: 2rem; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .cart-img-wrapper { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 4px; position: relative; }
      `}</style>
    </div>
  );
};

export default Orders;
