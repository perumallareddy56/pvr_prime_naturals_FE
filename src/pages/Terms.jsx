import React from 'react';
import { Container } from 'react-bootstrap';
import { LuBookOpen, LuCircleAlert, LuScale, LuGavel } from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const Terms = () => {
  useReveal();

  return (
    <div className="terms-page bg-charcoal min-vh-100 py-5">
      <Container className="reveal mt-4">
        <div className="glass-panel p-5 rounded-5 border border-white border-opacity-5 shadow-premium" style={{ background: 'var(--pvr-charcoal-light)' }}>
          <div className="mb-5 d-flex align-items-center gap-3">
             <LuScale className="text-gold" size={32} />
             <h1 className="text-white fw-bold mb-0">Terms and Conditions</h1>
          </div>
          
          <p className="text-gold smallest fw-bold text-uppercase letter-spacing-2 mb-5">Last Updated: April 2026</p>

          <div className="terms-content text-muted line-height-lg">
             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuBookOpen className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">Introduction</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">By accessing this website, you agree to comply with our terms. These terms govern your use of the PVR Prime Naturals website and services.</p>
             </section>

             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuCircleAlert className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">Orders & Payments</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">All orders are confirmed once payment is successfully processed. Prices are subject to market conditions.</p>
             </section>

             <section className="mb-5">
                 <div className="d-flex align-items-center gap-2 mb-3">
                     <LuGavel className="text-gold opacity-50" size={18} />
                     <h5 className="text-white fw-bold m-0 small text-uppercase letter-spacing-1">User Guidelines</h5>
                 </div>
                 <p className="smallest text-uppercase letter-spacing-1">Unauthorized attempts to bypass security measures or access private data will result in immediate account suspension and legal action.</p>
             </section>

             <section>
                 <div className="p-4 rounded-4 bg-charcoal border border-white border-opacity-5 text-center">
                    <p className="m-0 smallest text-gold italic">YOUR ACCESS MAY BE TERMINATED WITHOUT PRIOR NOTICE FOR VIOLATIONS OF THESE TERMS.</p>
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

export default Terms;
