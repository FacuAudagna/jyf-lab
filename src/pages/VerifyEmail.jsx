import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Token no proporcionado.');
      return;
    }

    setStatus('verifying');

    try {
      const res = await axios.get(`/api/auth/verify/${token}`);
      setStatus('success');
      setMessage(res.data.message);
    } catch (err) {
      setStatus('error');
      const errorMsg = err.response?.data?.error || 'Error al verificar la cuenta.';
      
      // Si el error es "cuenta ya verificada", lo tratamos como éxito parcial
      if (errorMsg.includes('ya verificada')) {
        setStatus('success');
        setMessage('Tu cuenta ya se encuentra verificada y activa. Puedes iniciar sesión.');
      } else {
        setMessage(errorMsg);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="login-logo">
          {status === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : status === 'error' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          )}
        </div>
        
        <h2 className="login-title">Verificación de Cuenta</h2>
        
        <p style={{ margin: '20px 0', color: '#cbd5e1', lineHeight: '1.5' }}>
          {status === 'idle' && 'Haz clic en el botón de abajo para confirmar tu correo electrónico y activar tu cuenta en JYF Lab.'}
          {status === 'verifying' && 'Verificando tu cuenta, por favor espera...'}
          {status === 'success' && message}
          {status === 'error' && <span style={{ color: '#fca5a5' }}>{message}</span>}
        </p>

        {status === 'idle' && (
          <button onClick={handleVerify} className="login-btn" style={{ width: '100%', marginBottom: '16px' }}>
            Confirmar mi correo electrónico
          </button>
        )}

        {status === 'verifying' && (
          <span className="spinner" style={{ display: 'inline-block', margin: '20px auto' }}></span>
        )}

        {(status === 'success' || status === 'error') && (
          <Link to="/login" className="login-btn" style={{ textDecoration: 'none', display: 'block' }}>
            Ir a Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
