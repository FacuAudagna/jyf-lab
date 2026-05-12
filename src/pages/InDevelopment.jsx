import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const InDevelopment = ({ title }) => {
  return (
    <Layout title={`Módulo de ${title}`} subtitle="Módulo en construcción">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', flex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '60px', borderRadius: '24px', maxWidth: '500px', width: '100%' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🚧</div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-h)', marginBottom: '12px' }}>{title}</h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
            Esta sección se encuentra actualmente en desarrollo activo. Pronto estará disponible con todas sus funcionalidades.
          </p>
          <Link to="/dashboard" className="login-btn" style={{ textDecoration: 'none', display: 'inline-flex', padding: '12px 24px' }}>
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default InDevelopment;
