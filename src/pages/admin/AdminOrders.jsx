import React, { useEffect, useState, useContext } from 'react';
import { Table, Form, Card, Modal, Button, Row, Col, InputGroup, ProgressBar, Dropdown } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import useReveal from '../../hooks/useReveal';
import { useWebSocket } from '../../context/WebSocketContext';
import { AuthContext } from '../../context/AuthContext';
import { 
  LuSearch, 
  LuEye, 
  LuBox, 
  LuTruck, 
  LuCircleCheck, 
  LuCircleX, 
  LuPrinter,
  LuReceipt,
  LuUser,
  LuShieldCheck,
  LuCalendar,
  LuPackage,
  LuHistory,
  LuChevronRight,
  LuWallet,
  LuCreditCard,
  LuSmartphone
} from 'react-icons/lu';
import Pagination from '../../components/Pagination';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { stompClient, connected } = useWebSocket();
  const { currentUser } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time synchronization
  useEffect(() => {
    if (connected && stompClient) {
      const subscription = stompClient.subscribe('/topic/orders/admin', (message) => {
        fetchOrders();
      });
      return () => subscription.unsubscribe();
    }
  }, [connected, stompClient]);

  useReveal([loading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/admin');
      setOrders(res.data);
    } catch (e) { 
      toast.error("Logistics link failure");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      toast.success(`Manifest #${orderId} redirected to ${newStatus}`);
      fetchOrders();
    } catch (e) { 
      toast.error('Protocol violation');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PLACED': return { color: 'var(--pvr-gold)', icon: LuReceipt, pulse: true };
      case 'PACKED': return { color: '#f39c12', icon: LuBox, pulse: false };
      case 'SHIPPED': return { color: 'var(--trending-cyan)', icon: LuTruck, pulse: false };
      case 'DELIVERED': return { color: '#28a745', icon: LuCircleCheck, pulse: false };
      case 'CANCELLED': return { color: '#dc3545', icon: LuCircleX, pulse: false };
      default: return { color: '#6c757d', icon: LuBox, pulse: false };
    }
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    return (
      <div className={`badge rounded-pill px-3 py-1 smallest fw-bold text-uppercase border border-opacity-25`} style={{ background: `${config.color}15`, color: config.color, borderColor: config.color }}>
        {status}
      </div>
    );
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) || 
    o.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-gold" role="status"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Logistics Command</h2>
          <p className="text-muted mb-0 small text-uppercase letter-spacing-1">REAL-TIME FULFILLMENT OVERSIGHT</p>
        </div>
        <div className="d-flex gap-3">
          <InputGroup className="bg-charcoal rounded-pill px-3 border border-white border-opacity-10 shadow-inner" style={{ maxWidth: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-gold">
                <LuSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Query manifest..."
                className="bg-transparent border-0 text-white shadow-none ps-0 smallest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </InputGroup>
           <div className="glass-panel px-4 py-2 rounded-pill border border-white border-opacity-10 d-none d-lg-flex align-items-center gap-2" style={{ background: 'var(--pvr-charcoal-light)' }}>
              <div className="live-dot"></div>
              <span className="text-muted smallest fw-bold letter-spacing-1">{orders.length} ACTIVE THREADS</span>
           </div>
        </div>
      </div>

      <Card className="glass-panel border-0 overflow-hidden reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table variant="dark" hover className="mb-0 align-middle text-white border-0 custom-admin-table">
              <thead>
                <tr className="smallest text-uppercase letter-spacing-2">
                  <th className="ps-4 py-4 text-gold border-0">MANIFEST ID</th>
                  <th className="py-4 text-gold border-0">OPERATOR</th>
                  <th className="py-4 text-gold border-0 text-center">VALUATION</th>
                  <th className="py-4 text-gold border-0 text-center">PROTOCOL STATE</th>
                  <th className="py-4 text-gold border-0 text-center">TIMESTAMP</th>
                  <th className="pe-4 py-4 text-gold border-0 text-end">ACTIONS</th>
                </tr>
              </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-light opacity-25 italic smallest">No telemetry detected in this sector.</td></tr>
              ) : (
                filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => (
                  <tr key={order.id} className="transition-all hover-row">
                    <td className="ps-4 py-4">
                        <span className="fw-bold text-gold letter-spacing-1">#ORD-{order.id.toString().padStart(5, '0')}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-charcoal-off border border-white border-opacity-10 p-2 me-3 shadow-inner">
                            <LuUser className="text-gold" size={18} />
                        </div>
                        <div>
                            <div className="fw-bold text-white small">{order.userName}</div>
                            <div className="text-muted smallest opacity-50 text-uppercase letter-spacing-1">Authorized Account</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                        <div className="fw-bold text-white small">₹{order.totalAmount.toFixed(2)}</div>
                        <div className="text-gold opacity-25 smallest">Verified Tx</div>
                    </td>
                    <td className="text-center">
                        {getStatusBadge(order.status)}
                    </td>
                    <td className="text-center">
                        <div className="text-white opacity-75 small">{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className="text-muted smallest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <Button variant="outline-warning" size="sm" className="rounded-pill px-3 py-1 fw-bold text-uppercase letter-spacing-1 d-flex align-items-center gap-2 border-opacity-50 h-100" onClick={() => setSelectedOrder(order)}>
                          <LuEye size={14} /> <span className="smallest">VIEW DETAILS</span>
                        </Button>
                        <div className="vr opacity-10 mx-1"></div>
                        <Dropdown align="end" className="d-flex align-items-center h-100">
                          <Dropdown.Toggle variant="dark" size="sm" className="rounded-pill border border-white border-opacity-10 py-1 fw-bold smallest text-uppercase letter-spacing-1 d-flex align-items-center gap-2 px-3">
                            STATUS
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="bg-dark border border-white border-opacity-10 shadow-lg">
                            {['PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(st => {
                                const ConfigIcon = getStatusConfig(st).icon;
                                return (
                                  <Dropdown.Item 
                                      key={st}
                                      className={`d-flex align-items-center py-2 ${order.status === st ? 'text-warning fw-bold bg-white bg-opacity-10' : 'text-white opacity-75'}`}
                                      onClick={() => {
                                          if (st === 'CANCELLED' && !window.confirm('ABORT Manifest?')) return;
                                          handleStatusChange(order.id, st);
                                      }}
                                  >
                                     <ConfigIcon size={16} className="me-2" style={{ color: getStatusConfig(st).color }} /> 
                                     <span className="small text-uppercase letter-spacing-1">{st}</span>
                                  </Dropdown.Item>
                                )
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {filteredOrders.length > itemsPerPage && (
            <div className="p-4 border-top border-white border-opacity-5">
              <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>

      {/* Advanced Telemetry Details Modal */}
      <Modal show={!!selectedOrder} onHide={() => setSelectedOrder(null)} size="lg" centered contentClassName="glass-panel border-white border-opacity-10 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 bg-charcoal p-4">
          <Modal.Title className="fw-bold text-white">
            <span className="text-gold me-2">MANIFEST #ORD-{selectedOrder?.id?.toString().padStart(5, '0')}</span> 
            <span className="text-muted smallest text-uppercase opacity-50 fw-normal">| TELEMETRY REPORT</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark p-0">
          {selectedOrder && (
            <div className="p-4 p-lg-5">
              <Row className="mb-5 g-4">
                <Col md={6}>
                  <div className="p-4 rounded-4 bg-charcoal border border-white border-opacity-5 h-100 shadow-inner">
                    <h6 className="text-gold fw-bold text-uppercase mb-4 letter-spacing-1 smallest">
                       <LuUser className="me-2" /> ORIGIN OPERATOR
                    </h6>
                    <div className="h4 text-white mb-1 fw-bold">{selectedOrder.userName}</div>
                    <div className="text-muted smallest text-uppercase letter-spacing-1">AUTH LVL: PREMIUM ENTHUSIAST</div>
                    <div className="d-flex align-items-center mt-4">
                       <div className="rounded-circle bg-dark p-2 me-3 border border-white border-opacity-10"><LuCalendar className="text-gold" /></div>
                       <div>
                          <div className="text-muted smallest text-uppercase">TIMESTAMP</div>
                          <div className="text-white small fw-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                       </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-4 rounded-4 bg-charcoal border border-white border-opacity-5 h-100 shadow-inner">
                    <h6 className="text-gold fw-bold text-uppercase mb-4 letter-spacing-1 smallest">
                       <LuHistory className="me-2" /> PROTOCOL STATE
                    </h6>
                    <div className="mb-4">{getStatusBadge(selectedOrder.status)}</div>
                    <ProgressBar 
                        now={['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED'].indexOf(selectedOrder.status) * 33.33 + 10} 
                        variant="warning" 
                        animated={selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED'}
                        style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }} 
                        className="rounded-pill"
                    />
                    <div className="mt-2 text-muted smallest text-uppercase d-flex justify-content-between">
                        <span>Initiated</span>
                        <span className="text-gold fw-bold">{selectedOrder.status}</span>
                    </div>
                    <div className="mt-4 pt-4 border-top border-white border-opacity-5">
                       <div className="text-muted smallest text-uppercase mb-2 letter-spacing-1">PAYMENT CHANNEL</div>
                       <div className="d-flex align-items-center">
                          {selectedOrder.paymentMethod === 'COD' ? <LuWallet className="text-gold me-2" /> : (selectedOrder.paymentMethod === 'UPI' ? <LuSmartphone className="text-gold me-2" /> : <LuCreditCard className="text-gold me-2" />)}
                          <span className="text-white small fw-bold">
                             {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : (selectedOrder.paymentMethod === 'UPI' ? 'UPI Transaction' : 'Online Payment')}
                          </span>
                       </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <h6 className="text-gold fw-bold text-uppercase mb-4 letter-spacing-1 smallest">
                 <LuPackage className="me-2" /> MANIFEST CONTENTS
              </h6>
              <div className="table-responsive rounded-4 border border-white border-opacity-5 overflow-hidden mb-5 shadow-inner bg-charcoal">
                <Table className="mb-0 bg-transparent text-white border-0">
                  <thead className="bg-dark border-bottom border-white border-opacity-5 opacity-50 smallest text-uppercase letter-spacing-1">
                    <tr>
                      <th className="ps-4 py-3 border-0">UNIT</th>
                      <th className="py-3 border-0">VALUATION</th>
                      <th className="py-3 border-0 text-center">QUANTITY</th>
                      <th className="pe-4 py-3 border-0 text-end">ACCUMULATED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map(item => (
                      <tr key={item.id} className="border-bottom border-white border-opacity-5 last-child-border-0">
                        <td className="ps-4 py-4">
                          <div className="fw-bold text-white small">{item.productName}</div>
                          <div className="text-gold opacity-25 smallest">SKU-{item.id.toString().padStart(6, '0')}</div>
                        </td>
                        <td className="py-4 text-muted small">₹{item.priceAtPurchase?.toFixed(2)}</td>
                        <td className="py-4 text-center">
                          <div className="bg-dark px-2 py-1 rounded-pill border border-white border-opacity-10 d-inline-block smallest fw-bold">x{item.quantity}</div>
                        </td>
                        <td className="pe-4 py-4 text-end fw-bold text-gold small">
                          ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-between align-items-center p-4 bg-charcoal rounded-4 border border-white border-opacity-10 shadow-premium">
                 <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                        <LuShieldCheck size={24} />
                    </div>
                    <div>
                        <div className="text-white fw-bold small">SECURE TRANSACTION</div>
                        <div className="text-muted smallest text-uppercase">ENCRYPTED CHANNEL VERIFIED</div>
                    </div>
                 </div>
                 <div className="text-end">
                    <div className="text-muted smallest text-uppercase mb-1">TOTAL VALUATION</div>
                    <div className="h2 mb-0 fw-bold text-white">₹{selectedOrder.totalAmount?.toFixed(2)}</div>
                 </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-charcoal border-top border-white border-opacity-10 py-3 px-4">
          <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => setSelectedOrder(null)}>DISMISS</Button>
          <Button variant="warning" className="rounded-pill px-4 py-2 smallest fw-bold shimmer" onClick={() => window.print()}>
            <LuPrinter className="me-2" /> PRINT MANIFEST
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .bg-charcoal-off { background-color: var(--pvr-charcoal-off); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.15); }
      `}</style>
    </div>
  );
};

export default AdminOrders;
