import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, ProgressBar, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useReveal from '../../hooks/useReveal';
import { 
  LuTrendingUp, 
  LuTrendingDown, 
  LuIndianRupee, 
  LuShoppingBag, 
  LuUsers, 
  LuPackage, 
  LuRefreshCw, 
  LuFileText,
  LuShieldAlert,
  LuCircleCheck,
  LuUser
} from 'react-icons/lu';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalUsers: 0, totalProducts: 0 });
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useReveal([loading]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, lowRes, recentRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/low-stock'),
        api.get('/admin/dashboard/recent-orders')
      ]);
      setStats(statsRes.data);
      setLowStock(lowRes.data);
      setRecentOrders(recentRes.data);
    } catch (e) {
      console.error("Error fetching dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Syncing Core...</span>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, percentage }) => (
    <Card className="glass-panel border-0 h-100 reveal overflow-hidden shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="rounded-4 d-flex align-items-center justify-content-center shimmer" 
               style={{ width: '54px', height: '54px', background: `rgba(${color}, 0.1)`, border: `1px solid rgba(${color}, 0.2)` }}>
            <Icon size={24} style={{ color: `rgb(${color})` }} />
          </div>
          <div className="text-end">
             <div className={`px-2 py-1 rounded-pill small fw-bold border ${trend >= 0 ? 'bg-success-soft text-success border-success' : 'bg-danger-soft text-danger border-danger'}`} style={{ fontSize: '0.7rem', background: trend >= 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)' }}>
                {trend >= 0 ? <LuTrendingUp className="me-1" /> : <LuTrendingDown className="me-1" />}
                {Math.abs(trend)}%
             </div>
          </div>
        </div>
        <div>
          <h3 className="fw-bold text-white mb-1">{value}</h3>
          <div className="text-gold opacity-50 small fw-bold text-uppercase letter-spacing-1">{title}</div>
        </div>
        <div className="mt-4">
            <div className="d-flex justify-content-between smallest mb-1">
                <span className="text-white text-uppercase letter-spacing-1">Node Load</span>
                <span className="text-white fw-bold">{percentage}%</span>
            </div>
            <ProgressBar now={percentage} style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Dashboard</h2>
          <p className="text-muted mb-0 small text-uppercase letter-spacing-1">STORE PERFORMANCE OVERVIEW</p>
        </div>
        <div className="d-flex gap-2">
            <Button variant="outline-warning" className="rounded-pill px-4 py-2 shimmer border-opacity-25" onClick={fetchDashboardData} style={{ fontSize: '0.8rem' }}>
              <LuRefreshCw className="me-2" /> REFRESH DATA
            </Button>
            <Button variant="warning" className="rounded-pill px-4 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>
              <LuFileText className="me-2" /> GENERATE REPORT
            </Button>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col xl={3} md={6}>
          <StatCard title="Total Sales" value={`₹${stats.totalSales?.toLocaleString()}`} icon={LuIndianRupee} color="212, 175, 55" trend={12.5} percentage={84} />
        </Col>
        <Col xl={3} md={6}>
          <StatCard title="Orders" value={stats.totalOrders} icon={LuShoppingBag} color="40, 167, 69" trend={5.2} percentage={62} />
        </Col>
        <Col xl={3} md={6}>
          <StatCard title="Active Users" value={stats.totalUsers} icon={LuUsers} color="0, 242, 255" trend={-2.4} percentage={45} />
        </Col>
        <Col xl={3} md={6}>
          <StatCard title="Inventory Items" value={stats.totalProducts} icon={LuPackage} color="255, 140, 0" trend={8.1} percentage={92} />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="glass-panel border-0 h-100 overflow-hidden reveal" style={{ background: 'var(--pvr-charcoal-light)' }}>
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-white d-flex align-items-center">
                <div className="live-dot me-3"></div>
                Recent Orders
              </h5>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-warning rounded-pill px-3 border-opacity-25" style={{ fontSize: '0.7rem' }}>VIEW ALL LOGS</Link>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table variant="dark" hover className="mb-0 align-middle border-0 custom-admin-table">
                  <thead>
                    <tr className="smallest text-uppercase letter-spacing-2">
                      <th className="ps-4 py-4 text-gold border-0">ORDER ID</th>
                      <th className="py-4 text-gold border-0">CUSTOMER</th>
                      <th className="py-4 text-gold border-0">TOTAL AMOUNT</th>
                      <th className="py-4 text-gold border-0">STATUS</th>
                      <th className="pe-4 py-4 text-gold border-0 text-end">TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-light opacity-25">No recent orders found.</td></tr>
                    ) : (
                      recentOrders.map(order => (
                        <tr key={order.id} className="transition-all hover-row">
                          <td className="ps-4 py-4">
                              <span className="text-gold fw-bold letter-spacing-1">#PVR-{order.id.toString().padStart(4, '0')}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-charcoal-off border border-white border-opacity-10 p-2 me-3 shadow-inner">
                                  <LuUser className="text-gold" size={18} />
                              </div>
                              <div>
                                  <div className="fw-bold text-white small">{order.userName}</div>
                                  <div className="text-muted smallest opacity-50 text-uppercase letter-spacing-1">Ref: #PVR-{order.id.toString().padStart(4, '0')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold text-white">
                             <span className="opacity-50 small me-1">₹</span>{order.totalAmount?.toFixed(2)}
                          </td>
                          <td>
                            <div className={`badge rounded-pill px-3 py-2 smallest fw-bold text-uppercase ${
                              order.status?.toLowerCase() === 'delivered' ? 'bg-success-subtle text-success border-success-subtle' : 
                              order.status?.toLowerCase() === 'shipped' ? 'bg-info-subtle text-info border-info-subtle' :
                              'bg-warning-subtle text-warning border-warning-subtle'
                            }`} style={{ 
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                              {order.status}
                            </div>
                          </td>
                          <td className="text-white-50 smallest pe-4 text-end font-monospace">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="glass-panel border-0 h-100 overflow-hidden reveal" style={{ background: 'var(--pvr-charcoal-light)' }}>
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-4 px-4">
              <h5 className="mb-0 fw-bold text-white d-flex align-items-center">
                <LuShieldAlert className="text-warning me-2" /> Low Stock Alerts
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {lowStock.length === 0 ? (
                <div className="text-center py-5">
                   <LuCircleCheck className="display-4 mb-3 d-block text-success mx-auto" />
                   <h6 className="fw-bold text-white mb-2">Status: All Good!</h6>
                   <p className="smallest text-uppercase letter-spacing-1 text-white mb-0">All inventory sectors functioning at capacity.</p>
                </div>
              ) : (
                <div className="supply-alerts">
                  {lowStock.map(p => (
                    <div key={p.id} className="bg-charcoal p-3 rounded-4 border border-white border-opacity-10 mb-3 hover-glow transition-all">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="fw-bold text-white text-truncate small" style={{ maxWidth: '70%' }}>{p.name}</div>
                        <Badge bg="danger" className="smallest fw-bold shimmer">CRITICAL</Badge>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                         <div className="smallest text-muted text-uppercase letter-spacing-1">Remaining: {p.stockQuantity}</div>
                         <Link to="/admin/products" className="smallest text-gold text-decoration-none fw-bold">RESTOCK</Link>
                      </div>
                      <ProgressBar now={(p.stockQuantity / 20) * 100} variant="danger" style={{ height: '2px', marginTop: '10px' }} className="rounded-pill" />
                    </div>
                  ))}
                  <Link to="/admin/products" className="btn btn-outline-warning w-100 rounded-pill mt-3 smallest fw-bold border-opacity-25">
                    VIEW ALL PRODUCTS
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .bg-charcoal-off { background-color: var(--pvr-charcoal-off); }
        .hover-glow:hover {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
            background: rgba(255, 255, 255, 0.05) !important;
        }
        .bg-success-soft { background: rgba(57, 255, 20, 0.1); }
        .bg-danger-soft { background: rgba(255, 46, 46, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
