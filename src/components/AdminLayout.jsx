import React, { useContext, useState } from 'react';
import { Container, Row, Col, Nav, Dropdown, Button, Badge } from 'react-bootstrap';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuShoppingCart, 
  LuBox, 
  LuTags, 
  LuStore, 
  LuChevronRight, 
  LuSettings, 
  LuActivity, 
  LuPower,
  LuTerminal,
  LuCpu,
  LuMenu,
  LuX
} from 'react-icons/lu';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

const menuItems = [
  { path: '/admin/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { path: '/admin/orders', icon: LuShoppingCart, label: 'Orders' },
  { path: '/admin/products', icon: LuBox, label: 'Products' },
  { path: '/admin/categories', icon: LuTags, label: 'Categories' },
];

const AdminLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const item = menuItems.find(i => location.pathname.includes(i.path));
    if (item) return item.label;
    if (location.pathname.includes('/admin/profile')) return 'Identity Configuration';
    return 'Command Centre';
  };

  return (
    <div className="admin-wrapper bg-dark min-vh-100 d-flex text-white">
      {/* Sidebar - Terminal Style */}
      {sidebarOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50 d-lg-none" style={{ zIndex: 1045 }} onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`admin-sidebar-new bg-charcoal border-end border-white border-opacity-10 ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-header p-4 d-flex align-items-center justify-content-between">
          <Link to="/admin" className="text-decoration-none" onClick={() => setSidebarOpen(false)}><Logo height="35px" /></Link>
          <Button variant="link" className="p-0 border-0 d-lg-none" onClick={() => setSidebarOpen(false)}>
            <LuX size={24} className="text-white opacity-50" />
          </Button>
        </div>

        <div className="sidebar-section-label px-4 mt-4 mb-2 small text-uppercase opacity-25 fw-bold letter-spacing-2" style={{ fontSize: '0.6rem' }}>
            Management Phase
        </div>
        <Nav className="flex-column px-3">
          {menuItems.map((item) => (
            <Nav.Link 
              key={item.path}
              as={Link} 
              to={item.path} 
              className={`sidebar-link mb-2 ${location.pathname.includes(item.path) ? 'active' : ''}`}
            >
              <item.icon className="me-3" size={18} />
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        <div className="mt-auto p-3 border-top border-white border-opacity-10 mx-3 mb-3 pt-3">
            <div className="sidebar-section-label px-1 mb-2 small text-uppercase opacity-25 fw-bold letter-spacing-1" style={{ fontSize: '0.6rem' }}>
                Operational Exit
            </div>
            <Nav.Link as={Link} to="/" className="sidebar-link mb-2 text-warning opacity-75">
               <LuStore className="me-3" size={18} />
               <span>Return to Store</span>
             </Nav.Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content d-flex flex-column">
        {/* Top Navbar - Glassmorphism */}
        <header className="admin-top-nav bg-dark border-bottom border-white border-opacity-5 px-4 py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button variant="link" className="p-0 border-0 me-3 d-lg-none hvr-grow" onClick={() => setSidebarOpen(true)}>
              <LuMenu size={24} className="text-gold" />
            </Button>
            <div className="d-none d-md-block">
                <h6 className="mb-0 fw-bold text-gold text-uppercase letter-spacing-2 d-flex align-items-center" style={{ fontSize: '0.65rem' }}>
                    <Logo height="22px" className="me-3" /> PVR-CORE <LuChevronRight className="mx-2 opacity-50 text-white" />
                </h6>
            </div>
            <h5 className="mb-0 fw-bold text-white ms-md-1 animate-fade-in" key={location.pathname}>
                {getPageTitle()}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-charcoal rounded-pill border border-white border-opacity-10 d-none d-md-flex shimmer">
                 <div className="live-dot" style={{ background: 'var(--trending-cyan)' }}></div>
                 <span className="text-muted smallest fw-bold text-uppercase" style={{ color: 'var(--trending-cyan) !important' }}>Node Active</span>
            </div>
            
            <div className="text-end d-none d-lg-block">
              <div className="text-white small fw-bold">{user?.name || 'Administrator'}</div>
              <div className="text-gold opacity-75 smallest fw-bold letter-spacing-1">ROOT OPERATOR</div>
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="p-0 border-0 no-caret">
                <div className="user-avatar-premium rounded-circle bg-charcoal d-flex align-items-center justify-content-center text-gold fw-bold border border-white border-opacity-10 shadow-sm" 
                     style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
                  {(user?.name || 'A')[0].toUpperCase()}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-dark shadow-premium border-white border-opacity-10 mt-3 p-2 rounded-4" style={{ background: 'var(--pvr-charcoal-light)' }}>
                <Dropdown.Item as={Link} to="/admin/profile" className="rounded-3 py-2">
                    <LuSettings className="me-2 text-gold" /> Identity Config
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/dashboard" className="rounded-3 py-2">
                    <LuTerminal className="me-2 text-gold" /> System Status
                </Dropdown.Item>
                <Dropdown.Divider className="border-white border-opacity-10" />
                <Dropdown.Item onClick={handleLogout} className="text-danger rounded-3 py-2">
                    <LuPower className="me-2" /> Shutdown Session
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content-scroll flex-grow-1 overflow-auto p-4 p-lg-5 bg-dark">
          <Outlet />
        </div>
      </main>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .admin-sidebar-new {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 1050;
          overflow-y: auto;
        }
        .admin-main-content {
          margin-left: 260px;
          flex-grow: 1;
          min-height: 100vh;
          background: var(--bg-dark);
          transition: margin-left 0.3s ease;
        }
        .admin-top-nav {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          background: rgba(8, 7, 6, 0.4) !important;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          z-index: 1040;
          position: sticky;
          top: 0;
        }
        .sidebar-link {
          color: rgba(255, 255, 255, 0.45) !important;
          border-radius: 12px;
          padding: 0.9rem 1.2rem !important;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          white-space: nowrap;
          font-weight: 500;
        }
        .sidebar-link:hover {
          background: rgba(212, 175, 55, 0.05);
          color: var(--pvr-gold) !important;
        }
        .sidebar-link.active {
          background: var(--pvr-gold) !important;
          color: #000 !important;
          font-weight: 700;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
        }
        .user-avatar-premium:hover {
            border-color: var(--pvr-gold) !important;
            transform: scale(1.05);
        }
        @media (max-width: 1024px) {
          .admin-sidebar-new {
            transform: translateX(-100%);
            width: 280px;
          }
          .admin-main-content {
            margin-left: 0;
          }
          .admin-sidebar-new.show {
            transform: translateX(0);
          }
        }
        .letter-spacing-2 { letter-spacing: 0.15rem; }
        .smallest { font-size: 0.65rem; }
        .no-caret::after { display: none !important; }
        .admin-content-scroll::-webkit-scrollbar { width: 6px; }
        .admin-content-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
