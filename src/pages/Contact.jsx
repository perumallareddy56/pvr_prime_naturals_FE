import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  LuInstagram, 
  LuFacebook, 
  LuLinkedin,
  LuMail,
  LuPhone,
  LuMapPin,
  LuSend,
  LuMessageSquare,
  LuShieldCheck,
  LuChevronRight
} from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const Contact = () => {
  useReveal();
  const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page bg-charcoal min-vh-100">
      {/* Cinematic Contact Hero */}
      <section className="about-hero py-5 position-relative overflow-hidden mb-5" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-60 z-0"></div>
        <div className="position-absolute top-0 start-0 w-100 h-100 z-0" style={{ backgroundImage: "url('/assets/brand/contact_hero.png')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(4px) brightness(0.3)' }}></div>
        <Container className="reveal z-1 text-center mt-5">
          <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Get in Touch</span>
          <h1 className="text-white fw-bold display-2 mt-3 mb-0">Contact <span className="text-gold">PVR</span></h1>
          <p className="text-white opacity-100 mt-4 fs-5 mx-auto smallest text-uppercase letter-spacing-1" style={{maxWidth: '600px', textShadow: '0 0 10px rgba(255,255,255,0.3)'}}>
            Wholesale inquiries, feedback, or general questions? Our team is here to assist you.
          </p>
        </Container>
      </section>

      {/* Contact Grid */}
      <section className="py-5">
        <Container>
          <Row className="g-5 reveal">
            <Col lg={5}>
              <div className="glass-panel h-100 p-5 rounded-5 border border-white border-opacity-5 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
                <h3 className="text-white fw-bold mb-5">Our <span className="text-gold">Locations</span></h3>
                
                <div className="mb-5 d-flex gap-4">
                    <div className="rounded-circle bg-charcoal p-3 border border-white border-opacity-5 h-auto align-self-start"><LuMapPin className="text-gold" size={24} /></div>
                    <div>
                        <h6 className="text-gold text-uppercase smallest fw-bold mb-2 letter-spacing-1">Flagship Boutique</h6>
                        <p className="text-white opacity-75 small line-height-md mb-0">Nexus Hub, Indiranagar, <br />Bengaluru, Karnataka 560038</p>
                    </div>
                </div>

                <div className="mb-5 d-flex gap-4">
                    <div className="rounded-circle bg-charcoal p-3 border border-white border-opacity-5 h-auto align-self-start"><LuShieldCheck className="text-gold" size={24} /></div>
                    <div>
                        <h6 className="text-gold text-uppercase smallest fw-bold mb-2 letter-spacing-1">Corporate HQ</h6>
                        <p className="text-white opacity-75 small line-height-md mb-0">45 Heritage Lane, Wyand, <br />Kerala 673121</p>
                    </div>
                </div>

                <div className="mb-5 d-flex gap-4">
                    <div className="rounded-circle bg-charcoal p-3 border border-white border-opacity-5 h-auto align-self-start"><LuPhone className="text-gold" size={24} /></div>
                    <div>
                        <h6 className="text-gold text-uppercase smallest fw-bold mb-2 letter-spacing-1">Customer Support</h6>
                        <p className="text-white opacity-75 small line-height-md mb-0">+91 98491 08718 <br />hello@pvrprimenaturals.com</p>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-top border-white border-opacity-5">
                  <div className="d-flex gap-4">
                    <a href="#" className="text-gold opacity-50 hvr-grow"><LuInstagram size={24} /></a>
                    <a href="#" className="text-gold opacity-50 hvr-grow"><LuFacebook size={24} /></a>
                    <a href="#" className="text-gold opacity-50 hvr-grow"><LuLinkedin size={24} /></a>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={7}>
              <div className="glass-panel p-5 rounded-5 border border-white border-opacity-5 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
                <div className="d-flex align-items-center gap-3 mb-5">
                    <LuMessageSquare className="text-gold" size={28} />
                    <h3 className="text-white fw-bold mb-0">Send a <span className="text-gold">Message</span></h3>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Your Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          className="ps-3 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                          placeholder="Your Name" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          className="ps-3 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                          placeholder="name@example.com" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Subject</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="ps-3 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                      placeholder="Wholesale Inquiry / Feedback" 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-5">
                    <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2">Your Message</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      className="ps-3 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest" 
                      placeholder="How can we assist your gourmet journey today?" 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </Form.Group>
                  <Button variant="warning" type="submit" className="w-100 py-3 fw-bold shadow-premium shimmer smallest rounded-pill">
                     <LuSend className="me-2" /> SEND MESSAGE
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Cinematic Map Section Placeholder */}
      <section className="reveal py-5 mt-5">
        <Container>
          <div className="glass-panel p-5 rounded-5 border border-white border-opacity-5 text-center shadow-premium" style={{ background: 'var(--pvr-charcoal-light)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 className="text-white display-4 fw-bold mb-3">Our <span className="text-gold">Presence</span></h2>
            <p className="text-white mb-5 smallest text-uppercase letter-spacing-1">Find our premium boutique stores in Bengaluru and Kerala</p>
            <Button variant="link" className="text-gold text-decoration-none fw-bold smallest letter-spacing-1">VIEW ON MAP <LuChevronRight className="ms-1" /></Button>
          </div>
        </Container>
      </section>
      
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .line-height-md { line-height: 1.6; }
        
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }

        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
};

export default Contact;
