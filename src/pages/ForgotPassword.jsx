import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { LuMail, LuArrowLeft, LuShieldCheck, LuSparkles } from 'react-icons/lu';
import Logo from '../components/Logo';
import useReveal from '../hooks/useReveal';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useReveal([loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success("Recovery instructions dispatched.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate recovery. Please verify your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-charcoal min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth-container reveal glass-panel rounded-5 overflow-hidden shadow-premium p-4 p-md-5" style={{ maxWidth: '500px', width: '95%', background: 'var(--pvr-charcoal-light)' }}>
        <div className="text-center mb-5">
          <Logo height="40px" className="mb-4" />
          <h2 className="text-white fw-bold h4 mb-2">Account Recovery</h2>
          <p className="text-gold smallest fw-bold text-uppercase letter-spacing-2">PVR Security Protocol</p>
        </div>

        {!submitted ? (
          <Form onSubmit={handleSubmit}>
            <p className="text-white opacity-75 small text-center mb-5">
              Enter your registered email address below. If an account exists, we will transmit a secure reset link to your terminal.
            </p>
            
            <Form.Group className="mb-5">
              <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2 letter-spacing-1">Email Address</Form.Label>
              <div className="position-relative">
                <LuMail className="position-absolute text-gold opacity-50" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <Form.Control 
                  type="email" 
                  required 
                  placeholder="yourname@email.com"
                  className="ps-3 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </Form.Group>

            <Button 
              disabled={loading} 
              variant="warning"
              className="w-100 rounded-pill py-3 fw-bold shadow-premium shimmer smallest mb-4 letter-spacing-1 border-0" 
              type="submit"
              style={{ background: 'var(--pvr-gold)', color: 'black' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                   <LuShieldCheck size={18} /> DISPATCH LINK
                </span>
              )}
            </Button>
          </Form>
        ) : (
          <div className="text-center py-4">
             <div className="rounded-circle bg-success bg-opacity-10 p-4 d-inline-block mb-4 text-success shadow-inner">
                <LuShieldCheck size={48} />
             </div>
             <h4 className="text-white fw-bold mb-3">Check Your Inbox</h4>
             <p className="text-white opacity-75 small mb-5">
                A secure transmission has been sent to <strong>{email}</strong> if it is registered in our system.
             </p>
             <Button as={Link} to="/login" variant="outline-warning" className="rounded-pill px-4 py-2 smallest fw-bold border-opacity-25 hvr-grow">
                RETURN TO LOGIN
             </Button>
          </div>
        )}

        {!submitted && (
          <div className="text-center mt-3">
            <Link to="/login" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1 hvr-grow d-inline-flex align-items-center gap-2">
              <LuArrowLeft size={14} /> BACK TO LOGIN
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .bg-charcoal { background-color: #0c0a09; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .focus-gold:focus {
            border-color: var(--pvr-gold) !important;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05) !important;
        }
        .hvr-grow { transition: transform 0.2s ease; }
        .hvr-grow:hover { transform: scale(1.05); }
        .auth-container { border: 1px solid rgba(255,255,255,0.05); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.5); }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
