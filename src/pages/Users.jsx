import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`)) return;

    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      // Update local state
      setUsers(users.map(u => u.id_user === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el rol');
    }
  };

  return (
    <Layout title="Gestión de Usuarios" subtitle="Administra los roles y accesos del sistema">
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {error && <div style={{ padding: '16px', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)' }}>{error}</div>}
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Cargando usuarios...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Usuario</th>
                  <th style={{ padding: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Email</th>
                  <th style={{ padding: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Estado</th>
                  <th style={{ padding: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Rol Actual</th>
                  <th style={{ padding: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id_user} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', color: '#f8fafc' }}>{u.username}</td>
                    <td style={{ padding: '16px', color: '#cbd5e1' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '12px',
                        fontWeight: 600,
                        background: u.is_verified ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                        color: u.is_verified ? '#86efac' : '#fcd34d'
                      }}>
                        {u.is_verified ? 'Verificado' : 'Pendiente'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '12px',
                        fontWeight: 600,
                        background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(148,163,184,0.15)',
                        color: u.role === 'admin' ? '#a5b4fc' : '#cbd5e1'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {/* Evitamos que el usuario se modifique a sí mismo para evitar accidentes */}
                      {currentUser.userId === u.id_user ? (
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Tú</span>
                      ) : (
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id_user, e.target.value)}
                          style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="operador">Operador</option>
                          <option value="admin">Administrador</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
