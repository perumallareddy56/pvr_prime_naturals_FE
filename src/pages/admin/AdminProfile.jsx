import React, { useEffect, useState, useContext } from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import useReveal from '../../hooks/useReveal';
import { 
  LuShieldCheck, 
  LuUser, 
  LuCamera, 
  LuCpu, 
  LuHash, 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuTrello,
  LuRefreshCcw
} from 'react-icons/lu';

const AdminProfile = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
    } catch (e) {
      toast.error("Failed to load your profile");
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
      toast.error("Failed to update profile");
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
      toast.info("Profile picture uploaded!");
    } catch (err) {
      console.error("Admin avatar upload failed", err);
      toast.error("Failed to upload image to S3");
    } finally {
      setUploadingAvatar(false);
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
      <div className="mb-5">
        <h2 className="fw-bold text-white mb-1">Admin Profile</h2>
        <p className="text-muted small text-uppercase letter-spacing-1">MANAGE YOUR ACCOUNT SETTINGS</p>
      </div>

      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="glass-panel border-0 overflow-hidden reveal shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
            <Card.Header className="bg-charcoal border-bottom border-white border-opacity-10 p-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                 <LuShieldCheck className="text-gold" size={24} />
                 <h6 className="mb-0 fw-bold text-white text-uppercase letter-spacing-1 small">Personal Details</h6>
              </div>
              <Badge bg="dark" className="border border-gold border-opacity-25 text-gold px-3 py-2 rounded-pill fw-bold smallest">ADMINISTRATOR</Badge>
            </Card.Header>
            <Card.Body className="p-4 p-lg-5 bg-dark">
              <Form onSubmit={handleUpdate}>
                <div className="text-center mb-5">
                  <div 
                    className="avatar-container position-relative d-inline-block"
                    onClick={() => !uploadingAvatar && document.getElementById('adminAvatarUpload').click()}
                  >
                    <div 
                      className="rounded-circle bg-charcoal d-flex align-items-center justify-content-center mx-auto shadow-inner overflow-hidden" 
                      style={{ width: '130px', height: '130px', border: '3px solid var(--pvr-gold)', cursor: 'pointer', position: 'relative' }}
                    >
                      {uploadingAvatar ? (
                        <div className="spinner-border text-gold" role="status"></div>
                      ) : profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Admin" className="w-100 h-100 object-fit-cover" />
                      ) : (
                        <LuUser size={64} className="text-gold opacity-25" />
                      )}
                    </div>
                    <div className="avatar-edit-overlay rounded-circle d-flex align-items-center justify-content-center">
                        <LuCamera className="text-white" size={32} />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="adminAvatarUpload" 
                    accept="image/*" 
                    className="d-none" 
                    onChange={handleAvatarChange} 
                    disabled={uploadingAvatar}
                  />
                  <div className="mt-3 text-gold smallest fw-bold text-uppercase letter-spacing-1">
                    {uploadingAvatar ? 'UPLOADING...' : 'CHANGE PROFILE PICTURE'}
                  </div>
                </div>

                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Full Name</Form.Label>
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
                      <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Email Address</Form.Label>
                      <div className="position-relative">
                        <LuMail className="position-absolute text-muted opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <Form.Control 
                          type="email" 
                          value={profile.email} 
                          disabled 
                          className="ps-3 pe-5 py-3 bg-dark text-muted border-white border-opacity-5 rounded-4 opacity-50 smallest"
                          style={{ cursor: 'not-allowed' }}
                        />
                      </div>
                      <Form.Text className="text-muted smallest italic">Primary email cannot be modified.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Phone Number</Form.Label>
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
                        <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Account Type</Form.Label>
                        <div className="position-relative">
                          <LuTrello className="position-absolute text-muted opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                          <Form.Control 
                            type="text" 
                            value="Administrator Master" 
                            disabled 
                            className="ps-3 pe-5 py-3 bg-dark text-muted border-white border-opacity-5 rounded-4 opacity-50 smallest"
                            style={{ cursor: 'not-allowed' }}
                          />
                        </div>
                     </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="text-gold fw-bold smallest text-uppercase mb-2">Headquarters Address</Form.Label>
                      <div className="position-relative">
                        <LuMapPin className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '25px' }} />
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          placeholder="Logistics Hub / HQ Address..."
                          value={profile.address || ''} 
                          onChange={e => setProfile({...profile, address: e.target.value})}
                          className="ps-3 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="mt-5 pt-3 border-top border-white border-opacity-10 d-flex justify-content-end align-items-center gap-3">
                   <Button variant="link" className="text-muted smallest text-uppercase text-decoration-none fw-bold" onClick={() => fetchProfile()}>
                      <LuRefreshCcw className="me-2" /> RESET
                   </Button>
                   <Button variant="warning" type="submit" className="rounded-pill px-5 py-2 smallest fw-bold shadow-premium shimmer">
                    <LuCpu className="me-2" /> SAVE CHANGES
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .avatar-container {
            cursor: pointer;
            transition: all 0.3s ease;
        }
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
        .avatar-container:hover .avatar-edit-overlay {
            opacity: 1;
        }
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        .smallest {
            font-size: 0.65rem;
        }
        .letter-spacing-1 {
            letter-spacing: 1.5px;
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
