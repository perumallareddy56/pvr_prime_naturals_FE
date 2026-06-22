import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { LuLock, LuShieldCheck, LuArrowLeft, LuCheck, LuEye, LuEyeOff } from 'react-icons/lu';
import Logo from '../components/Logo';
import useReveal from '../hooks/useReveal';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useReveal([loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      toast.success("Security credentials updated successfully.");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol failure: Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
     return (
        <div className="auth-page bg-charcoal min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
               <h2 className="text-white fw-bold mb-4">Access Denied</h2>
               <p className="text-muted mb-4 text-uppercase smallest letter-spacing-2">Link Invalid or Corrupted</p>
               <Button as={Link} to="/login" variant="warning" className="rounded-pill px-5 py-2 fw-bold smallest">RETURN TO SAFETY</Button>
            </div>
        </div>
     );
  }

  return (
    <div className="auth-page bg-charcoal min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth-container reveal glass-panel rounded-5 overflow-hidden shadow-premium p-4 p-md-5" style={{ maxWidth: '500px', width: '95%', background: 'var(--pvr-charcoal-light)' }}>
        <div className="text-center mb-5">
          <Logo height="40px" className="mb-4" />
          <h2 className="text-white fw-bold h4 mb-2">Secure Reset</h2>
          <p className="text-gold smallest fw-bold text-uppercase letter-spacing-2">Update Credentials</p>
        </div>

        {!success ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2 letter-spacing-1">New Password</Form.Label>
              <div className="position-relative">
                <LuLock className="position-absolute text-gold opacity-30" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="ps-5 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <div 
                  className="position-absolute text-gold opacity-50 cursor-pointer hvr-grow" 
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2 letter-spacing-1">Confirm Password</Form.Label>
              <div className="position-relative">
                <LuLock className="position-absolute text-gold opacity-30" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <Form.Control 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="ps-5 pe-5 py-3 bg-charcoal text-white border-white border-opacity-10 rounded-4 focus-gold smallest"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <div 
                  className="position-absolute text-gold opacity-50 cursor-pointer hvr-grow" 
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </div>
              </div>
            </Form.Group>

            <Button 
              disabled={loading} 
              variant="warning"
              className="w-100 rounded-pill py-3 fw-bold shadow-premium shimmer smallest letter-spacing-1 border-0" 
              type="submit"
              style={{ background: 'var(--pvr-gold)', color: 'black' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                   <LuShieldCheck size={18} /> UPDATE PASSWORD
                </span>
              )}
            </Button>
          </Form>
        ) : (
          <div className="text-center py-4">
             <div className="rounded-circle bg-success bg-opacity-10 p-4 d-inline-block mb-4 text-success shadow-inner">
                <LuCheck size={48} />
             </div>
             <h4 className="text-white fw-bold mb-3">Protocol Complete</h4>
             <p className="text-muted small mb-5">
                Your new security configuration is live. You are being redirected to the authentication terminal.
             </p>
             <div className="spinner-grow text-gold" role="status" style={{ width: '1rem', height: '1rem' }}></div>
          </div>
        )}

        {!success && (
          <div className="text-center mt-3">
            <Link to="/login" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1 hvr-grow d-inline-flex align-items-center gap-2">
              <LuArrowLeft size={14} /> ABORT SESSION
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

export default ResetPassword;
