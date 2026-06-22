import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  LuInstagram, 
  LuFacebook, 
  LuMessageCircle, 
  LuYoutube, 
  LuArrowRight, 
  LuUsers, 
  LuChefHat, 
  LuShieldCheck, 
  LuLeaf,
  LuMail, 
  LuPhone,
  LuTerminal,
  LuGlobe,
  LuActivity
} from 'react-icons/lu';
import Logo from './Logo';

const Footer = () => {
  const handleJoin = (e) => {
    e.preventDefault();
    toast.success("Thank you for joining our newsletter!");
  };

  const socialLink = (e) => {
    e.preventDefault();
    toast.info("Follow us for updates! (Coming soon)");
  };

  return (
    <footer className="footer-nexus bg-charcoal position-relative overflow-hidden pt-5">
      {/* Background Decorative Glows */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10 pointer-events-none">
          <div className="position-absolute" style={{ width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--pvr-gold) 0%, transparent 70%)', top: '-20vw', left: '-10vw', filter: 'blur(80px)' }}></div>
          <div className="position-absolute" style={{ width: '30vw', height: '30vw', background: 'radial-gradient(circle, var(--trending-cyan) 0%, transparent 70%)', bottom: '-15vw', right: '-5vw', filter: 'blur(100px)' }}></div>
      </div>

      <Container className="position-relative z-index-10">
        {/* Floating Brand & CTA Nexus */}
        <div className="glass-panel p-4 p-lg-5 rounded-5 border border-white border-opacity-10 mb-5 reveal shadow-premium" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
            <Row className="align-items-center g-4">
                <Col lg={7} className="text-center text-lg-start">
                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-3">
                        <div className="live-dot pulse" style={{ background: 'var(--pvr-gold)' }}></div>
                        <span className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Premium Quality</span>
                    </div>
                    <h2 className="display-5 text-white fw-bold mb-3">Elevating the <span className="text-gold">Art</span> of Gastronomy</h2>
                    <p className="text-white opacity-80 smallest text-uppercase letter-spacing-1 mb-0 max-width-500 mx-auto mx-lg-0">
                        Direct from artisanal farms to your kitchen. PVR ensures a perfect balance between tradition and quality.
                    </p>
                </Col>
                <Col lg={5} className="text-center text-lg-end">
                    <Button as={Link} to="/products" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium shimmer smallest letter-spacing-2 border-0" style={{ background: 'var(--pvr-gold)', color: 'black' }}>
                        BROWSE PRODUCTS <LuArrowRight className="ms-2" />
                    </Button>
                </Col>
            </Row>
        </div>

        <Row className="g-5 py-5">
          {/* Brand & Social Node */}
          <Col lg={4}>
            <div className="brand-node reveal">
               <div className="mb-4">
                  <Logo height="50px" />
               </div>
               <p className="smallest text-uppercase letter-spacing-1 pe-lg-5 mb-5 opacity-80 line-height-lg text-white">
                 PVR brings you the finest hand-selected gourmet essentials, traditionally processed to preserve natural oils and authentic natural flavors.
               </p>
               <div className="d-flex gap-3">
                  {[LuInstagram, LuFacebook, LuMessageCircle, LuYoutube].map((Icon, i) => (
                    <a key={i} href="#" className="social-pill" onClick={socialLink}>
                      <Icon size={18} />
                    </a>
                  ))}
               </div>
            </div>
          </Col>

          {/* Navigation Matrix */}
          <Col lg={5}>
            <Row className="g-4">
              <Col sm={6}>
                 <h6 className="text-gold smallest fw-bold text-uppercase letter-spacing-2 mb-4 d-flex align-items-center gap-2">
                    <LuActivity size={14} /> COMPANY
                 </h6>
                 <ul className="list-unstyled d-flex flex-column gap-3">
                    {[
                      { name: 'OUR STORY', path: '/about' },
                      { name: 'PRODUCTS', path: '/products' },
                      { name: 'CONTACT US', path: '/contact' },
                      { name: 'MY ACCOUNT', path: '/profile' }
                    ].map((link, i) => (
                      <li key={i}>
                        <Link to={link.path} className="nexus-link">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                 </ul>
              </Col>
              <Col sm={6}>
                 <h6 className="text-gold smallest fw-bold text-uppercase letter-spacing-2 mb-4 d-flex align-items-center gap-2">
                    <LuGlobe size={14} /> OUR PROMISE
                 </h6>
                 <ul className="list-unstyled d-flex flex-column gap-3">
                   {[
                     { icon: LuUsers, text: 'DIRECT FROM FARM' },
                     { icon: LuChefHat, text: 'STONE GROUND' },
                     { icon: LuShieldCheck, text: 'PURITY TESTED' },
                     { icon: LuLeaf, text: 'ECO PACKAGING' }
                   ].map((item, i) => (
                     <li key={i} className="d-flex align-items-center gap-3 smallest fw-bold letter-spacing-1 text-white opacity-80">
                       <item.icon className="text-gold" size={14} /> {item.text}
                     </li>
                   ))}
                 </ul>
              </Col>
            </Row>
          </Col>

          {/* Telemetry Subscription */}
          <Col lg={3}>
             <div className="telemetry-node glass-panel p-4 rounded-4 border border-white border-opacity-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <h6 className="text-gold smallest fw-bold text-uppercase letter-spacing-2 mb-3">Newsletter</h6>
                <p className="text-light opacity-75 smallest text-uppercase letter-spacing-1 mb-4">Stay updated on new products.</p>
                <Form onSubmit={handleJoin}>
                  <Form.Group className="mb-3">
                    <Form.Control 
                        type="email" 
                        placeholder="Your email address" 
                        className="ps-3 py-2 bg-charcoal text-white border-white border-opacity-10 rounded-pill focus-gold smallest" 
                        required 
                    />
                  </Form.Group>
                  <Button type="submit" variant="warning" className="w-100 rounded-pill py-2 smallest fw-bold shadow-premium shimmer border-0" style={{ background: 'var(--pvr-gold)', color: 'black' }}>
                    SUBSCRIBE
                  </Button>
                </Form>
                <div className="mt-4 pt-3 border-top border-white border-opacity-5">
                    <div className="d-flex align-items-center gap-3 mb-2 opacity-80">
                        <LuMail className="text-gold" size={14} />
                        <span className="text-white smallest fw-bold uppercase">HELLO@PVRPRIMENATURALS.COM</span>
                    </div>
                </div>
             </div>
          </Col>
        </Row>

        {/* Condensed Operational Bottom */}
        <div className="footer-bottom py-4 mt-5 border-top border-white border-opacity-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3 opacity-80">
                <span className="smallest text-uppercase letter-spacing-1 text-white">© 2026 PVR Prime Naturals</span>
            </div>
            
            <div className="smallest fw-bold letter-spacing-1">
                <span className="text-white opacity-50">DESIGNED BY </span>
                <span className="text-gold px-2 py-1 rounded bg-white bg-opacity-5">P. PRADEEP REDDY</span>
            </div>

            <div className="d-flex gap-4 opacity-80">
              <Link to="/privacy" className="text-white text-decoration-none smallest fw-bold letter-spacing-1 hover-gold transition-all">PRIVACY</Link>
              <Link to="/terms" className="text-white text-decoration-none smallest fw-bold letter-spacing-1 hover-gold transition-all">TERMS</Link>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .bg-charcoal { background-color: #080706; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .line-height-lg { line-height: 1.8; }
        
        .social-pill {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            color: var(--pvr-gold);
            opacity: 0.6;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .social-pill:hover {
            background: var(--pvr-gold);
            color: black;
            opacity: 1;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        .nexus-link {
            text-decoration: none;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: white !important;
            opacity: 0.8;
            transition: all 0.3s ease;
            display: inline-block;
        }
        .nexus-link:hover {
            color: var(--pvr-gold) !important;
            opacity: 1 !important;
            transform: translateX(5px);
        }

        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        
        .max-width-500 { max-width: 500px; }
        
        .footer-nexus {
            background-image: 
                radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(0, 242, 255, 0.05) 0px, transparent 50%);
        }

        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }
        .live-dot.pulse {
            animation: pulse 2s infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
