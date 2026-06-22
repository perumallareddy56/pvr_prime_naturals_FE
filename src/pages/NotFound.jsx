import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LuTriangleAlert, LuArrowLeft, LuSearch } from 'react-icons/lu';
import useReveal from '../hooks/useReveal';

const NotFound = () => {
  useReveal();

  return (
    <div className="bg-charcoal min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Container className="reveal text-center">
        <div className="position-relative d-inline-block mb-5">
          <LuTriangleAlert className="text-gold opacity-10" size={150} />
          <h1 className="position-absolute top-50 start-50 translate-middle text-white fw-bold display-1 m-0">404</h1>
        </div>
        <h2 className="text-white fw-bold display-4 mb-3">Protocol Disrupted</h2>
        <p className="text-muted smallest text-uppercase letter-spacing-2 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
          The requested coordinate does not exist within the gourmet nexus. 
          The link and telemetry data has been purged or moved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/" variant="warning" className="rounded-pill px-5 py-3 fw-bold shadow-premium shimmer smallest">
            <LuArrowLeft className="me-2" /> RETURN TO NEXUS
          </Button>
          <Button as={Link} to="/products" variant="link" className="text-gold text-decoration-none fw-bold smallest letter-spacing-1">
            <LuSearch className="me-2" /> DISCOVER REPOSITORY
          </Button>
        </div>
      </Container>
      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default NotFound;
