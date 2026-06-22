import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import useReveal from '../hooks/useReveal';
import { 
  LuHistory, 
  LuUser, 
  LuRefreshCcw, 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuCamera,
  LuShieldCheck,
  LuChevronRight,
  LuCpu
} from 'react-icons/lu';

const Profile = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Trigger scroll reveals
  useReveal([loading, authLoading]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [currentUser, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Could not load your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', profile);
      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Could not update your profile");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) {
      toast.error("Image is too large. Limit: 5MB");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile({...profile, avatarUrl: res.data.url});
      toast.info("Picture uploaded! Click 'Save Changes' to keep it.");
    } catch (err) {
      console.error("Avatar upload failed", err);
      toast.error("Failed to upload image to S3");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-charcoal min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-gold" role="status"></div>
      </div>
    );
  }

  return (
    <div className="profile-page min-vh-100 py-5 bg-charcoal">
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="mb-5 text-center reveal">
              <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">My Profile</span>
              <h2 className="text-white fw-bold display-5 mb-0">Account Settings</h2>
              <div className="title-underline mx-auto mt-3"></div>
            </div>

            <Card className="glass-panel border-0 overflow-hidden reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
              <Card.Header className="bg-charcoal border-bottom border-white border-opacity-10 py-4 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <LuShieldCheck className="text-gold" size={24} />
                  <h6 className="mb-0 fw-bold text-white text-uppercase letter-spacing-1 small d-none d-md-block">Personal Details</h6>
                </div>
                <div className="d-flex gap-3">
                  <Button as={Link} to="/orders" variant="outline-warning" className="rounded-pill px-4 btn-sm fw-bold border-opacity-25 bg-charcoal">
                    ACTIVE ORDERS
                  </Button>
                  <Button as={Link} to="/order-history" variant="link" className="text-gold smallest fw-bold text-uppercase text-decoration-none hvr-grow">
                    <LuHistory className="me-2" /> VIEW ALL ORDERS <LuChevronRight className="ms-1" />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4 p-lg-5 bg-dark">
                <Form onSubmit={handleUpdate}>
                  <div className="text-center mb-5">
                    <div 
                      className="avatar-container position-relative d-inline-block shadow-lg rounded-circle"
                      onClick={() => document.getElementById('avatarUpload').click()}
                    >
                      <div 
                        className="rounded-circle bg-charcoal d-flex align-items-center justify-content-center overflow-hidden mx-auto border border-white border-opacity-10" 
                        style={{ width: '130px', height: '130px', border: '3px solid var(--pvr-gold)', cursor: 'pointer', position: 'relative' }}
                      >
                        {uploadingAvatar ? (
                          <div className="spinner-border text-gold" role="status"></div>
                        ) : profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <LuUser className="text-gold opacity-25" size={64} />
                        )}
                      </div>
                      <div className="avatar-edit-overlay rounded-circle d-flex align-items-center justify-content-center">
                          <LuCamera className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="mt-3 text-gold smallest fw-bold text-uppercase letter-spacing-2" style={{cursor: 'pointer'}} onClick={() => !uploadingAvatar && document.getElementById('avatarUpload').click()}>
                      {uploadingAvatar ? 'UPLOADING...' : 'CHANGE PROFILE PICTURE'}
                    </div>
                    <input 
                      id="avatarUpload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleAvatarChange} 
                    />
                  </div>

                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2 letter-spacing-1">Full Name</Form.Label>
                        <div className="position-relative">
                           <LuUser className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                           <Form.Control 
                             type="text" 
                             value={profile.name} 
                             onChange={e => setProfile({...profile, name: e.target.value})}
                             className="ps-3 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                             required
                           />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2 letter-spacing-1">Email Address</Form.Label>
                        <div className="position-relative">
                           <LuMail className="position-absolute text-muted opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                           <Form.Control 
                             type="email" 
                             value={profile.email} 
                             disabled 
                             className="ps-3 pe-5 py-3 bg-dark text-white border-white border-opacity-5 rounded-4 smallest"
                             style={{ cursor: 'not-allowed' }}
                           />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2 letter-spacing-1">Phone Number</Form.Label>
                        <div className="position-relative">
                           <LuPhone className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                           <Form.Control 
                             type="text" 
                             placeholder="+XX XXXXX XXXXX"
                             value={profile.phoneNumber || ''} 
                             onChange={e => setProfile({...profile, phoneNumber: e.target.value})}
                             className="ps-3 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                           />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2 letter-spacing-1">Member Type</Form.Label>
                        <div className="p-3 bg-dark rounded-4 border border-white border-opacity-5 d-flex align-items-center justify-content-between">
                            <span className="text-white smallest fw-bold text-uppercase">Premium</span>
                            <LuCpu size={16} className="text-gold opacity-50" />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2 letter-spacing-1">Delivery Address</Form.Label>
                        <div className="position-relative">
                           <LuMapPin className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '25px' }} />
                           <Form.Control 
                             as="textarea" 
                             rows={3} 
                             placeholder="Enter your full address for delivery..."
                             value={profile.address || ''} 
                             onChange={e => setProfile({...profile, address: e.target.value})}
                             className="ps-3 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                           />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="mt-5 text-end border-top border-white border-opacity-10 pt-4 d-flex justify-content-end align-items-center gap-3">
                    <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => fetchProfile()}>
                       <LuRefreshCcw className="me-2" /> CANCEL
                    </Button>
                    <Button type="submit" variant="warning" className="rounded-pill px-5 py-2 fw-bold shadow-premium shimmer smallest">
                      SAVE CHANGES
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .focus-gold:focus { border-color: var(--pvr-gold) !important; box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.05) !important; }
        input:disabled { color: #ffffff !important; opacity: 1 !important; -webkit-text-fill-color: #ffffff; }
        .avatar-container { cursor: pointer; transition: all 0.3s ease; }
        .avatar-edit-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .avatar-container:hover .avatar-edit-overlay { opacity: 1; }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

export default Profile;
