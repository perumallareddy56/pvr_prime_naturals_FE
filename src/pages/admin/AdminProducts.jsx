import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, InputGroup, ProgressBar } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import useReveal from '../../hooks/useReveal';
import { 
  LuPlus, 
  LuSearch, 
  LuPencil, 
  LuArchive, 
  LuRotateCcw, 
  LuTrash2, 
  LuChevronRight,
  LuLayoutGrid,
  LuDatabase,
  LuWeight,
  LuIndianRupee,
  LuPackage,
  LuX
} from 'react-icons/lu';
import Pagination from '../../components/Pagination';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    weight: '',
    subCategory: { id: '' }
  });

  useReveal([loading]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?activeOnly=false');
      setProducts(res.data);
    } catch (e) { 
      toast.error("Failed to sync product inventory");
    } finally { 
      setLoading(false); 
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/types');
      setCategories(res.data);
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleCategoryChange = async (typeId) => {
    setSelectedCategory(typeId);
    if (typeId) {
      try {
        const res = await api.get(`/categories/types/${typeId}/subcategories`);
        setSubCategories(res.data);
      } catch (e) { 
        console.error(e); 
      }
    } else {
      setSubCategories([]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({...formData, imageUrl: res.data.url});
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      weight: product.weight || '',
      subCategory: { id: product.subCategory?.id || '' }
    });
    if (product.subCategory?.productType?.id) {
      handleCategoryChange(product.subCategory.productType.id);
    }
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    const isArchived = !product.active;
    const message = isArchived 
        ? 'PERMANENTLY delete this product? This cannot be undone.'
        : 'Archive this product? It will be hidden from the store.';

    if(window.confirm(message)) {
      try {
        await api.delete(`/products/${product.id}`);
        toast.success(isArchived ? 'Product deleted' : 'Product archived');
        fetchProducts();
      } catch (e) { 
        toast.error('Action failed');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/products/${id}/restore`);
      toast.success('Product restored');
      fetchProducts();
    } catch (e) { 
      toast.error('Restoration failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subCategory.id) {
        toast.warning("Please select a sub-category");
        return;
    }
    
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        toast.success('Product details updated');
      } else {
        await api.post('/products', formData);
        toast.success('New product added');
      }
      setShowModal(false);
      fetchProducts();
    } catch (e) { 
      toast.error('Please check your data and try again.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subCategory?.productType?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="fw-bold text-white mb-1">Product Management</h2>
          <p className="text-muted mb-0 small text-uppercase letter-spacing-1">MANAGE YOUR PRODUCT INVENTORY</p>
        </div>
        <Button variant="warning" className="rounded-pill px-4 py-2 fw-bold shimmer" style={{ fontSize: '0.85rem' }} onClick={() => {
          setEditingProduct(null);
          setFormData({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', weight: '', subCategory: { id: '' } });
          setSelectedCategory('');
          setShowModal(true);
        }}>
          <LuPlus className="me-2" /> ADD NEW PRODUCT
        </Button>
      </div>

      <Card className="glass-panel border-0 mb-4 overflow-hidden reveal" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Card.Body className="p-4">
           <InputGroup className="bg-charcoal rounded-pill px-3 border border-white border-opacity-10 shadow-inner" style={{ maxWidth: '400px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-gold">
                <LuSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search products..."
                className="bg-transparent border-0 text-white shadow-none ps-0 smallest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </InputGroup>
        </Card.Body>
      </Card>

      <Card className="glass-panel border-0 overflow-hidden reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table variant="dark" hover className="mb-0 align-middle text-white border-0 custom-admin-table">
              <thead>
                <tr className="smallest text-uppercase letter-spacing-2">
                  <th className="ps-4 py-4 text-gold border-0">PRODUCT</th>
                  <th className="py-4 text-gold border-0 text-center">CATEGORY</th>
                  <th className="py-4 text-gold border-0 text-center">PRICE</th>
                  <th className="py-4 text-gold border-0 text-center">STOCK</th>
                  <th className="pe-4 py-4 text-gold border-0 text-end">ACTIONS</th>
                </tr>
              </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-light opacity-25 italic smallest">No products found in this category.</td></tr>
              ) : (
                filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(product => (
                  <tr key={product.id} className={`transition-all hover-row ${!product.active ? 'opacity-30 grayscale' : ''}`}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-3 overflow-hidden me-3 border border-white border-opacity-10" style={{ width: '54px', height: '54px' }}>
                            <img src={product.imageUrl || '/assets/products/pepper.png'} 
                                 alt={product.name} className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div>
                            <div className="fw-bold text-white mb-0 small">{product.name}</div>
                            <div className="text-gold opacity-25 smallest">ID: {product.id.toString().padStart(4, '0')} | {product.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                        <div className={`badge rounded-pill bg-dark border border-white border-opacity-10 px-3 py-1 smallest fw-bold text-uppercase text-gold`}>
                          {product.subCategory?.productType?.name} <LuChevronRight className="mx-1" /> {product.subCategory?.name}
                        </div>
                    </td>
                    <td className="text-center">
                        <div className="fw-bold text-white small">₹{product.price.toFixed(2)}</div>
                        <div className="text-muted smallest">Standard Rate</div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-block" style={{ minWidth: '80px' }}>
                        <div className={`fw-bold smallest ${product.stockQuantity < 10 ? 'text-danger' : 'text-success'}`}>{product.stockQuantity} UNITS</div>
                        <ProgressBar 
                            now={Math.min(100, (product.stockQuantity / 50) * 100)} 
                            variant={product.stockQuantity < 10 ? 'danger' : 'success'} 
                            style={{ height: '2px', marginTop: '6px', background: 'rgba(255,255,255,0.05)' }} 
                            className="rounded-pill"
                        />
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-3">
                        <Button variant="link" className="text-gold p-0 hvr-grow" onClick={() => handleEdit(product)} title="Edit Product">
                          <LuPencil size={18} />
                        </Button>
                        {product.active ? (
                            <Button variant="link" className="text-warning p-0 hvr-grow" onClick={() => handleDelete(product)} title="Archive Product">
                                <LuArchive size={18} />
                            </Button>
                        ) : (
                            <Button variant="link" className="text-success p-0 hvr-grow" onClick={() => handleRestore(product.id)} title="Restore Product">
                                <LuRotateCcw size={18} />
                            </Button>
                        )}
                        <Button variant="link" className="text-danger p-0 hvr-grow" onClick={() => handleDelete(product)} title="Delete Permanently">
                          <LuTrash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
          {filteredProducts.length > itemsPerPage && (
            <div className="p-4 border-top border-white border-opacity-5">
              <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modern Product Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingProduct(null); }} size="lg" centered contentClassName="glass-panel border-white border-opacity-10 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 px-4 py-3 bg-charcoal">
          <Modal.Title className="fw-bold text-white small text-uppercase letter-spacing-1">
            <LuDatabase className="text-gold me-3" />
            {editingProduct ? 'Edit Product Details' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4 p-lg-5 bg-dark">
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Product Name</Form.Label>
                  <Form.Control required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" placeholder="e.g. Premium Turmeric" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Description</Form.Label>
                  <Form.Control as="textarea" rows={3} required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" placeholder="Describe the product..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Category</Form.Label>
                  <div className="position-relative">
                    <LuLayoutGrid className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <Form.Select required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 cursor-pointer focus-gold smallest appearance-none" value={selectedCategory} onChange={e => handleCategoryChange(e.target.value)}>
                      <option value="">Classification...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Sub-Category</Form.Label>
                  <Form.Select required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 cursor-pointer focus-gold smallest" value={formData.subCategory.id} onChange={e => setFormData({...formData, subCategory: { id: e.target.value }})}>
                    <option value="">Specific Hub...</option>
                    {subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Net Weight</Form.Label>
                  <div className="position-relative">
                    <LuWeight className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <Form.Control required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" placeholder="e.g. 500g" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Price (₹)</Form.Label>
                  <div className="position-relative">
                    <LuIndianRupee className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <Form.Control type="number" step="0.01" required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || ''})} />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Stock Quantity</Form.Label>
                  <div className="position-relative">
                    <LuPackage className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <Form.Control type="number" required className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: parseInt(e.target.value) || ''})} />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Product Image</Form.Label>
                  <Form.Control type="file" accept="image/*" className="p-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" onChange={handleImageUpload} disabled={uploadingImage} />
                  {uploadingImage && <div className="text-gold mt-2 smallest"><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Uploading image...</div>}
                  {formData.imageUrl && (
                     <div className="mt-3 rounded-4 border border-white border-opacity-10 overflow-hidden" style={{ width: '100px', height: '100px' }}>
                        <img src={formData.imageUrl} alt="preview" className="w-100 h-100 object-fit-cover" />
                     </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-top border-white border-opacity-10 px-4 py-3 bg-charcoal">
            <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
            <Button variant="warning" type="submit" className="rounded-pill px-5 py-2 fw-bold smallest shimmer">
               {editingProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        .bg-charcoal-off { background-color: var(--pvr-charcoal-off); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        .grayscale {
            filter: grayscale(1) brightness(0.5);
        }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.1); }
        .appearance-none { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
};

export default AdminProducts;
