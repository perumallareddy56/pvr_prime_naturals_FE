import React from 'react';
import { Container } from 'react-bootstrap';
import { LuShieldCheck, LuLock, LuEye, LuServer } from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const Privacy = () => {
  useReveal();

  return (
    <div className="privacy-page bg-charcoal min-vh-100 py-5">
      <Container className="reveal mt-4">
        <div className="glass-panel p-5 rounded-5 border border-white border-opacity-5 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
          <div className="mb-5 d-flex align-items-center gap-3">
             <LuShieldCheck className="text-gold" size={32} />
             <h1 className="text-white fw-bold mb-0">Privacy Policy</h1>
          </div>
          
          <p className="text-gold smallest fw-bold text-uppercase letter-spacing-2 mb-5">Last Updated: April 2026</p>

          <div className="privacy-content text-muted line-height-lg">
             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuEye className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">Information We Collect</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">We collect the basic information needed to process your orders, including your name, delivery address, and contact details.</p>
             </section>

             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuLock className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">Data Security</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">All account information is protected over secure channels. We use secure protocols for all communication between your device and our servers.</p>
             </section>

             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuServer className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">Data Storage</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">Your data is stored on our secure servers. We do not share your information with third parties without your permission.</p>
             </section>

             <section>
                 <div className="p-4 rounded-4 bg-charcoal border border-white border-opacity-5">
                    <p className="m-0 smallest text-gold italic">By accessing the PVR Prime Naturals website, you consent to these policies. For account deletion requests, contact: help@pvrprimenaturals.com</p>
                 </div>
             </section>
          </div>
        </div>
      </Container>
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .line-height-lg { line-height: 2; }
      `}</style>
    </div>
  );
};

export default Privacy;
