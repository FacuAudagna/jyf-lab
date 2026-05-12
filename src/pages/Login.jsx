import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';
import logoColor from '../assets/logos/logo-color.png';

const Login = () => {
  // Vistas: 'login' | 'forgot-password' | 'forgot-sent'
  const [view, setView] = useState('login');
  const [sentEmail, setSentEmail] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    setError('');
  }, [view]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Por favor, completa todos los campos.');
    
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return setError('Ingresa tu correo electrónico.');

    setIsSubmitting(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSentEmail(email);
      setView('forgot-sent');
    } catch (err) {
      setError('Ocurrió un error al procesar tu solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Vista: Recuperación de Contraseña Enviada ───
  if (view === 'forgot-sent') {
    return (
      <div className="login-container">
        <div className="login-bg-shape shape-1"></div>
        <div className="login-bg-shape shape-2"></div>
        
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="login-logo" style={{ background: 'transparent', boxShadow: 'none', width: '120px', height: 'auto', margin: '0 auto 24px' }}>
            <img src={logoColor} alt="JYF Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>

          <h1 className="login-title">Correo enviado</h1>
          <p className="login-subtitle" style={{ marginBottom: '16px' }}>Instrucciones de recuperación enviadas a:</p>
          
          <div style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 20px', margin: '0 0 24px', fontSize: '15px', color: 'var(--jyf-pink-bright)', fontWeight: 600, wordBreak: 'break-all' }}>
            {sentEmail}
          </div>

          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
            Revisá tu bandeja de entrada y hacé clic en el enlace para crear una nueva contraseña. El link es válido por <strong style={{color:'var(--text-h)'}}>1 hora</strong>.
          </div>

          <button onClick={() => setView('login')} className="login-btn" style={{ width: '100%' }}>Volver al inicio de sesión</button>
        </div>
      </div>
    );
  }

  // ─── Vistas: Login / Forgot Password ───
  return (
    <div className="login-container">
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" style={{ background: 'transparent', boxShadow: 'none', width: '120px', height: 'auto', margin: '0 auto 24px' }}>
            <img src={logoColor} alt="JYF Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <h1 className="login-title">
            {view === 'login' ? 'Bienvenido a JYF Lab' : 'Recuperar Contraseña'}
          </h1>
          <p className="login-subtitle">
            {view === 'login' ? 'Ingresa tus credenciales para continuar' : 'Te enviaremos instrucciones por correo'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={view === 'login' ? handleLogin : handleForgotPassword}>
          
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input type="email" className="login-input" placeholder="ejemplo@jyflab.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
            </div>
          </div>

          {view === 'login' && (
            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <button type="button" onClick={() => setView('forgot-password')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner"></span> Procesando...</>
            ) : view === 'login' ? 'Ingresar al Sistema' : 'Enviar instrucciones'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#94a3b8' }}>
            {view === 'login' ? (
              <p>¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--jyf-pink-bright)', fontWeight: 600, textDecoration: 'none' }}>Regístrate</Link></p>
            ) : (
              <p>¿Ya recuerdas tu contraseña? <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--jyf-pink-bright)', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Iniciar Sesión</button></p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
