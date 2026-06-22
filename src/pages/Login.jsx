import React, { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import useReveal from '../hooks/useReveal';
import { 
  LuMail, 
  LuLock, 
  LuArrowRight, 
  LuSparkles, 
  LuUser,
  LuShieldCheck,
  LuChevronRight,
  LuFingerprint,
  LuCpu,
  LuEye,
  LuEyeOff
} from 'react-icons/lu';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useReveal([loading]);

  useEffect(() => {
    if (currentUser) {
      if (isAdmin()) navigate('/admin');
      else navigate('/');
    }
  }, [currentUser, navigate, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success("Log in successful. Welcome back!");
      if (user.roles && user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-charcoal min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth-container reveal glass-panel rounded-5 overflow-hidden shadow-premium d-flex flex-column flex-lg-row" style={{ maxWidth: '1000px', width: '95%', minHeight: '600px', background: 'var(--pvr-charcoal-light)' }}>
        
        {/* Visual Terminal Side */}
        <div className="auth-visual d-none d-lg-flex flex-column justify-content-between p-5 position-relative overflow-hidden" 
             style={{ 
                 width: '42%', 
                 background: 'url(/assets/auth/login.png)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
             }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-60" style={{ background: 'linear-gradient(to bottom, rgba(8,7,6,0.95), rgba(8,7,6,0.4), rgba(8,7,6,0.95))' }}></div>
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, var(--pvr-gold) 0%, transparent 50%)' }}></div>
            <div className="position-absolute bottom-0 end-0 w-100 h-100 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 80%, var(--trending-cyan) 0%, transparent 50%)' }}></div>
            
            <div className="z-2">
                <div className="mb-5 reveal">
                   <Logo height="45px" />
                </div>
                <h2 className="text-white fw-bold display-5 mb-3 letter-spacing-1">PVR <span className="text-gold">CORE</span></h2>
                <p className="text-white opacity-50 smallest text-uppercase letter-spacing-2">Secure Account Access</p>
            </div>
            
            <div className="z-1">
                <div className="p-3 rounded-4 border border-white border-opacity-5 mb-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-gold smallest fw-bold text-uppercase mb-2">Security Status</div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="live-dot"></div>
                        <span className="text-white smallest fw-bold opacity-50">SECURE CONNECTION</span>
                    </div>
                </div>
                <p className="text-muted small opacity-50 line-height-md">Access your account to manage orders, view your wishlist, and track your gourmet spice journey.</p>
            </div>
        </div>

        {/* Interaction Form Side */}
        <div className="auth-form p-4 p-md-5 d-flex flex-column justify-content-center bg-dark bg-opacity-40" style={{ flex: 1 }}>
            <div className="mb-5 reveal">
                <h1 className="text-white fw-bold mb-2 display-6">Login to <span className="text-gold">Your Account</span></h1>
            </div>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
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

                <Form.Group className="mb-5">
                    <Form.Label className="text-gold smallest fw-bold text-uppercase mb-2 letter-spacing-1">Password</Form.Label>
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
                    <div className="text-end mt-2">
                        <Link to="/forgot-password" size="sm" className="text-gold smallest fw-bold text-decoration-none opacity-50 hover-opacity-100 transition-all">
                            FORGOT PASSWORD?
                        </Link>
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
                           <LuShieldCheck size={18} /> SIGN IN
                        </span>
                    )}
                </Button>
            </Form>

            <div className="text-center mt-3 reveal">
                <span className="text-white opacity-50 smallest text-uppercase letter-spacing-1">New to PVR Prime Naturals? </span>
                <Link to="/register" className="text-gold text-decoration-none smallest fw-bold letter-spacing-1 hvr-grow d-inline-flex align-items-center">
                    CREATE AN ACCOUNT <LuChevronRight size={14} className="ms-1" />
                </Link>
            </div>
        </div>
      </div>

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
        .hvr-grow:hover { transform: scale(1.05); }

        .auth-container {
            border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default Login;
