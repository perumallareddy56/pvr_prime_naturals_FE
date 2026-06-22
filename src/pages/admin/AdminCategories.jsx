import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Table } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import useReveal from '../../hooks/useReveal';
import { 
  LuPlus, 
  LuTrash2, 
  LuCircleX, 
  LuNetwork,
  LuLayers,
  LuLayoutGrid
} from 'react-icons/lu';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [subName, setSubName] = useState('');

  useReveal([loading]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/types');
      const fullData = await Promise.all(res.data.map(async (cat) => {
        try {
          const subRes = await api.get(`/categories/types/${cat.id}/subcategories`);
          return { ...cat, subCategories: subRes.data };
        } catch (e) {
          return { ...cat, subCategories: [] };
        }
      }));
      setCategories(fullData);
    } catch (e) {
      toast.error("Failed to sync classification data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories/types', { name: catName });
      toast.success('Core sector established');
      setCatName('');
      setShowCatModal(false);
      fetchCategories();
    } catch (e) {
      toast.error('Data error');
    }
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/categories/subcategories`, { 
        name: subName,
        productType: { id: currentCategory.id }
      });
      toast.success('Sub-sector integrated');
      setSubName('');
      setShowSubModal(false);
      fetchCategories();
    } catch (e) {
      toast.error('Data integration failed');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Decommission this core sector? All linked assets will be unbound.')) {
      try {
        await api.delete(`/categories/types/${id}`);
        toast.success('Sector purged');
        fetchCategories();
      } catch (e) {
        toast.error('Sector protected or busy');
      }
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (window.confirm('Purge this sub-sector?')) {
      try {
        await api.delete(`/categories/subcategories/${id}`);
        toast.success('Sub-sector removed');
        fetchCategories();
      } catch (e) {
        toast.error('Sub-sector in use');
      }
    }
  };

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
          <h2 className="fw-bold text-white mb-1">Taxonomy Hub</h2>
          <p className="text-muted mb-0 small text-uppercase letter-spacing-1">HIERARCHICAL CLASSIFICATION MANAGEMENT</p>
        </div>
        <Button variant="warning" className="rounded-pill px-4 py-2 fw-bold shimmer" style={{ fontSize: '0.85rem' }} onClick={() => setShowCatModal(true)}>
          <LuNetwork className="me-2" /> ESTABLISH NEW SECTOR
        </Button>
      </div>

      <Row className="g-4">
        {categories.map((cat, index) => (
          <Col lg={6} key={cat.id}>
            <Card className="glass-panel border-0 h-100 overflow-hidden reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)', transitionDelay: `${index * 0.1}s` }}>
              <Card.Header className="bg-charcoal border-bottom border-white border-opacity-10 p-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div className="live-dot" style={{ background: 'var(--pvr-gold)', boxShadow: '0 0 10px var(--pvr-gold)' }}></div>
                    <h6 className="mb-0 fw-bold text-white text-uppercase letter-spacing-1 small">{cat.name}</h6>
                </div>
                <div className="d-flex gap-1 bg-dark p-1 rounded-4 border border-white border-opacity-10">
                    <Button variant="link" className="text-gold p-1 hvr-grow" title="Add Sub-sector" onClick={() => { setCurrentCategory(cat); setShowSubModal(true); }}>
                        <LuPlus size={18} />
                    </Button>
                    <Button variant="link" className="text-danger p-1 hvr-grow" title="Purge Sector" onClick={() => handleDeleteCategory(cat.id)}>
                        <LuTrash2 size={18} />
                    </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle text-white border-0">
                  <thead className="opacity-50 smallest text-uppercase letter-spacing-1">
                    <tr className="border-bottom border-white border-opacity-5">
                      <th className="ps-4 py-3">SUB-SECTOR</th>
                      <th className="text-end pe-4">OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map(sub => (
                        <tr key={sub.id} className="border-bottom border-white border-opacity-5 last-child-border-0">
                          <td className="ps-4 py-3">
                            <div className="fw-bold text-white small">{sub.name}</div>
                            <div className="text-gold opacity-25 smallest">SUB-ID: {sub.id.toString().padStart(3, '0')}</div>
                          </td>
                          <td className="text-end pe-4">
                            <Button variant="link" className="text-danger p-0 hvr-grow" onClick={() => handleDeleteSubCategory(sub.id)}>
                              <LuCircleX size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-5 text-light opacity-25 italic smallest">No sub-sectors defined in this hub.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 p-3 pt-0 text-end">
                 <small className="text-muted smallest opacity-25">TYPE-HEX-{cat.id.toString().padStart(3, '0')}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modern Category Modal */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered contentClassName="glass-panel border-white border-opacity-10 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 bg-charcoal p-4">
          <Modal.Title className="fw-bold text-white small text-uppercase letter-spacing-1">
            <LuLayers className="text-gold me-3" /> Establish Core Sector
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCategory}>
          <Modal.Body className="p-4 p-lg-5 bg-dark">
            <Form.Group>
              <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Sector Designation</Form.Label>
              <Form.Control 
                required 
                className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                placeholder="e.g. Spices, Coffee..." 
                value={catName} 
                onChange={e => setCatName(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top border-white border-opacity-10 bg-charcoal p-3">
            <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => setShowCatModal(false)}>ABORT</Button>
            <Button variant="warning" type="submit" className="rounded-pill px-4 py-2 smallest fw-bold shimmer">EXECUTE LAUNCH</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modern Sub-Category Modal */}
      <Modal show={showSubModal} onHide={() => setShowSubModal(false)} centered contentClassName="glass-panel border-white border-opacity-10 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 bg-charcoal p-4">
          <Modal.Title className="fw-bold text-white small text-uppercase letter-spacing-1">
            <LuLayoutGrid className="text-gold me-3" /> Integrate Sub-Sector
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubCategory}>
          <Modal.Body className="p-4 p-lg-5 bg-dark">
            <div className="mb-4 p-3 rounded-4 bg-charcoal border border-white border-opacity-5">
                <div className="text-muted smallest text-uppercase mb-1">Parent Hierarchy</div>
                <div className="text-gold fw-bold">{currentCategory?.name}</div>
            </div>
            <Form.Group>
              <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Sub-Sector Identifier</Form.Label>
              <Form.Control 
                required 
                className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                placeholder="e.g. Black Pepper, Arabica..." 
                value={subName} 
                onChange={e => setSubName(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top border-white border-opacity-10 bg-charcoal p-3">
            <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => setShowSubModal(false)}>ABORT</Button>
            <Button variant="warning" type="submit" className="rounded-pill px-4 py-2 smallest fw-bold shimmer">INITIATE INTEGRATION</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .smallest { font-size: 0.65rem; }
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.1); }
        .last-child-border-0:last-child { border-bottom: 0 !important; }
      `}</style>
    </div>
  );
};

export default AdminCategories;
