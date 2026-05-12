import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) return setError('Completa todos los campos.');
    if (password !== confirmPassword) return setError('Las contraseñas no coinciden.');
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.');
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/auth/register', { username, email, password });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="login-container">
        <div className="login-bg-shape shape-1"></div>
        <div className="login-bg-shape shape-2"></div>
        
        <div className="login-card" style={{ textAlign: 'center' }}>
          <h1 className="login-title">¡Registro exitoso!</h1>
          <p className="login-subtitle" style={{ marginBottom: '16px' }}>
            Te enviamos un correo de verificación a:
          </p>
          
          <div style={{ 
            background: 'var(--accent-bg)', 
            border: '1px solid var(--border)',
            borderRadius: '10px', 
            padding: '12px 20px', 
            margin: '0 0 24px',
            fontSize: '15px',
            color: 'var(--jyf-pink-bright)',
            fontWeight: 600,
            wordBreak: 'break-all'
          }}>
            {email}
          </div>

          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
            Abrí tu bandeja de entrada y hacé clic en el botón <strong style={{color:'var(--text-h)'}}>"Verificar mi cuenta"</strong> para activar tu acceso.
          </div>

          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '24px' }}>
            ¿No llegó? Revisá la carpeta de <strong style={{color:'var(--text-h)'}}>Spam</strong>.
          </div>

          <Link to="/login" className="login-btn" style={{ textDecoration: 'none', display: 'block' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Crear Cuenta</h1>
          <p className="login-subtitle">Regístrate para acceder al sistema</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleRegister} autoComplete="off">
          <div className="input-group">
            <label>Nombre y Apellido</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" className="login-input" placeholder="ej. Juan Perez" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSubmitting} autoComplete="off" />
            </div>
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input type="email" className="login-input" placeholder="ejemplo@jyflab.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} autoComplete="off" />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} autoComplete="new-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting} autoComplete="new-password" />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner"></span> Procesando...</>
            ) : 'Completar Registro'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#94a3b8' }}>
            <p>¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--jyf-pink-bright)', fontWeight: 600, textDecoration: 'none' }}>Iniciar Sesión</Link></p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
