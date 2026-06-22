import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { 
  LuShieldCheck, 
  LuDroplets, 
  LuAward, 
  LuSparkles,
  LuHistory,
  LuTarget,
  LuLeaf,
  LuQuote,
  LuChevronRight,
  LuMapPin,
  LuChefHat,
  LuZap
} from 'react-icons/lu';
import useReveal from '../hooks/useReveal';
import heroImage from '../assets/hero-premium.png';
import processImage from '../assets/artisanal-process.png';
import heritageImage from '../assets/heritage-recipe.png';

const About = () => {
  useReveal();

  return (
    <div className="about-page bg-dark overflow-hidden">
      {/* Cinematic Hero */}
      <section className="about-hero-v2 min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        <div className="hero-background-gradient-gold"></div>
        <div className="hero-mesh-overlay"></div>
        <Container className="reveal position-relative z-index-10 mt-5">
          <Row className="align-items-center g-5">
            <Col lg={7} className="text-center text-lg-start">
               <Badge bg="transparent" className="border border-gold border-opacity-25 text-gold rounded-pill smallest fw-bold px-4 py-2 uppercase letter-spacing-2 mb-4">
                  Est. 2025 | Artisanal Excellence
               </Badge>
               <h1 className="display-1 fw-900 text-white mb-4 line-height-tight">
                 Crafting a <br />
                 <span className="text-gold">Legacy of Purity</span>
               </h1>
               <p className="text-light opacity-75 fs-5 mb-5 pe-lg-5 fw-light letter-spacing-1">
                 From the misty highlands to your kitchen, we are rediscovering the lost art of traditional processing. 
                 PVR isn't just a brand; it's a commitment to the soulful connection between earth and plate.
               </p>
               <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button variant="primary" className="btn-premium px-5 py-3 rounded-pill shadow-lg trending-glow">Explore Our Roots</Button>
                  <Button variant="outline-light" className="px-5 py-3 rounded-pill opacity-75">Watch Our Process</Button>
               </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
               <div className="hero-visual-hull reveal">
                  <div className="floating-glow"></div>
                  <img src={heroImage} alt="Legacy" className="img-fluid floating-animation-slow" style={{ filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.25))' }} />
               </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Legacy Timeline Section */}
      <section className="legacy-timeline py-5 bg-charcoal position-relative">
        <div className="section-divider-top"></div>
        <Container className="py-5">
          <div className="text-center mb-5 reveal">
            <span className="section-label">Our Journey</span>
            <h2 className="display-4 text-white fw-bold">The Timeline of <span className="text-gold">Tradition</span></h2>
          </div>
          
          <div className="timeline-container position-relative py-5">
            <div className="timeline-line"></div>
            {[
              { year: '2023', title: 'The Vision', desc: 'Inspired by a return to roots, we began scouting the hills for the purest heirloom varieties.', icon: LuTarget },
              { year: '2024', title: 'Artisanal Alliance', desc: 'Established direct partnerships with 50+ family-run farms in the Western Ghats.', icon: LuLeaf },
              { year: '2025', title: 'PVR Prime Naturals', desc: 'Bringing stone-ground quality and global standards to traditional Indian kitchen essentials.', icon: LuZap }
            ].map((item, idx) => (
              <Row key={idx} className={`timeline-row align-items-center mb-5 reveal ${idx % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <Col md={5} className={idx % 2 === 0 ? 'text-md-end' : 'text-md-start'}>
                   <div className="timeline-content glass-panel p-4 rounded-5 hover-lift">
                      <span className="text-gold fw-bold display-6 mb-2 d-block">{item.year}</span>
                      <h4 className="text-white mb-2">{item.title}</h4>
                      <p className="text-light opacity-75 smallest text-uppercase mb-0">{item.desc}</p>
                   </div>
                </Col>
                <Col md={2} className="text-center position-relative">
                   <div className="timeline-dot-outer">
                      <div className="timeline-dot-inner">
                         <item.icon size={20} className="text-dark" />
                      </div>
                   </div>
                </Col>
                <Col md={5}></Col>
              </Row>
            ))}
          </div>
        </Container>
      </section>

      {/* The Pillars - Interactive Grid */}
      <section className="quality-pillars py-5 bg-dark position-relative">
         <Container className="py-5">
            <Row className="g-5">
               <Col lg={4} className="reveal">
                  <div className="pillar-header sticky-top pt-5" style={{ top: '100px' }}>
                     <span className="section-label">Values</span>
                     <h2 className="display-5 text-white fw-bold mb-4">Built on <span className="text-gold">Purity</span></h2>
                     <p className="text-light opacity-75 pe-lg-4 mb-5 line-height-lg">
                        We don't optimize for volume; we optimize for fidelity. Every grain, bean, and spice 
                        carries the signature of its origin.
                     </p>
                     <Button variant="link" className="text-gold p-0 text-decoration-none fw-bold letter-spacing-2">LEARN ABOUT QUALITY <LuChevronRight /></Button>
                  </div>
               </Col>
               <Col lg={8}>
                  <Row className="g-4">
                     {[
                        { icon: LuShieldCheck, title: 'LAB-TESTED', desc: 'Zero adulteration, 100% purity. Every batch is analyzed for guaranteed quality.' },
                        { icon: LuDroplets, title: 'STONE-GROUND', desc: 'Traditional grinding process that avoids heat buildup, preserving natural oils and aromas.' },
                        { icon: LuHistory, title: 'TIME-HONORED', desc: 'Following regional drying and aging cycles that define authentic flavour profiles.' },
                        { icon: LuAward, title: 'EXPORT GRADE', desc: 'Stringent quality control that meets and exceeds international food standards.' }
                     ].map((item, idx) => (
                        <Col md={6} key={idx} className="reveal">
                           <div className="pillar-card glass-panel p-5 h-100 rounded-5 border border-white border-opacity-5 hover-lift">
                              <item.icon size={40} className="text-gold mb-4" />
                              <h5 className="text-white fw-bold mb-3">{item.title}</h5>
                              <p className="text-light opacity-75 small mb-0">{item.desc}</p>
                           </div>
                        </Col>
                     ))}
                  </Row>
               </Col>
            </Row>
         </Container>
      </section>

      {/* Founder's Thought - Split Screen */}
      <section className="founders-thought py-5 bg-charcoal position-relative overflow-hidden">
         <div className="bg-blur-gold"></div>
         <Container className="py-5">
            <Row className="align-items-center g-5">
               <Col lg={6} className="reveal">
                  <div className="story-frame p-2 rounded-5 border border-gold border-opacity-10 shadow-premium">
                     <img src={heritageImage} alt="The Process" className="img-fluid rounded-5 w-100" style={{ filter: 'grayscale(0.3) contrast(1.1)' }} />
                  </div>
               </Col>
               <Col lg={6} className="reveal px-lg-5">
                  <LuQuote size={60} className="text-gold opacity-10 mb-4" />
                  <h3 className="fs-4 text-white italic fw-light line-height-md mb-4 orient-quote">
                      "My vision was simple: I wanted to bring back the smells of my grandmother's kitchen, where every spice had a story and every meal was a ritual of health."
                  </h3>
                  <div className="d-flex align-items-center gap-4 mt-5">
                     <div className="founder-signature bg-white bg-opacity-5 p-4 rounded-4 border border-white border-opacity-10">
                        <h4 className="text-gold mb-1 font-signature">P. Pradeep Reddy</h4>
                        <p className="smallest text-white opacity-50 mb-0 letter-spacing-2">FOUNDER & CEO, PVR PRIME NATURALS</p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>

      {/* Detailed Process - Visual Section */}
      <section className="visual-process py-5 bg-dark">
         <Container className="py-5 text-center">
            <div className="reveal mb-5">
               <span className="section-label">Our Process</span>
               <h2 className="display-5 text-white fw-bold">Earth to <span className="text-gold">Excellence</span></h2>
            </div>
            <div className="process-visual-hull glass-panel p-2 p-lg-5 rounded-5 border border-white border-opacity-5 reveal">
               <img src={processImage} alt="Artisanal Process" className="img-fluid rounded-4 shadow-lg w-75 mx-auto d-block mb-5" />
               <Row className="g-4 text-start">
                  {[
                     { step: '01', title: 'Sourcing', desc: 'Direct farm selection of heirloom seeds.' },
                     { step: '02', title: 'Processing', desc: 'Stone-grinding with temperature control.' },
                     { step: '03', title: 'Quality Check', desc: 'Rigorous lab testing for purity.' },
                     { step: '04', title: 'Delivery', desc: 'Expertly sealed and packed for freshness.' }
                  ].map((p, i) => (
                     <Col md={3} key={i}>
                        <div className="process-step-node p-3">
                           <span className="text-gold display-6 fw-bold opacity-20 mb-2 d-block">{p.step}</span>
                           <h6 className="text-white fw-bold mb-2">{p.title}</h6>
                           <p className="smallest text-light opacity-75 text-uppercase letter-spacing-1">{p.desc}</p>
                        </div>
                     </Col>
                  ))}
               </Row>
            </div>
         </Container>
      </section>

      <style>{`
        .about-hero-v2 {
          background: #080706;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hero-background-gradient-gold {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.15), transparent 70%),
                      radial-gradient(circle at 20% 80%, rgba(0, 242, 255, 0.1), transparent 50%);
          pointer-events: none;
        }
        .hero-mesh-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.3;
        }
        .font-signature { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.8rem; }
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .line-height-tight { line-height: 1.1; }
        .line-height-md { line-height: 1.8; }
        .z-index-10 { z-index: 10; }
        .fw-900 { font-weight: 900; }
        
        .timeline-container { padding: 40px 0; }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--pvr-gold), transparent);
          opacity: 0.2;
          transform: translateX(-50%);
        }
        .timeline-dot-outer {
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          z-index: 2;
          position: relative;
        }
        .timeline-dot-inner {
          width: 36px;
          height: 36px;
          background: var(--pvr-gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }
        
        .pillar-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .pillar-card:hover {
          background: rgba(212, 175, 55, 0.05) !important;
          border-color: rgba(212, 175, 55, 0.2) !important;
        }
        
        .bg-blur-gold {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          top: 50%;
          right: -10%;
          transform: translateY(-50%);
          filter: blur(80px);
          pointer-events: none;
        }
        
        .btn-premium {
          background: var(--pvr-gold);
          color: black;
          border: none;
          font-weight: 700;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        .btn-premium:hover {
          background: white;
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        
        @media (max-width: 768px) {
          .timeline-line { left: 30px; }
          .timeline-dot-outer { margin-left: 5px; }
          .timeline-row { flex-direction: row !important; }
          .timeline-content { text-align: left !important; margin-left: 60px; }
        }
      `}</style>
    </div>
  );
};

export default About;
