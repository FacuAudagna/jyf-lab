import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import InDevelopment from './pages/InDevelopment';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          
          {/* Módulos en desarrollo */}
          <Route path="/clientes" element={<ProtectedRoute><InDevelopment title="Clientes" /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><InDevelopment title="Pedidos" /></ProtectedRoute>} />
          <Route path="/insumos" element={<ProtectedRoute><InDevelopment title="Insumos" /></ProtectedRoute>} />
          <Route path="/disenos" element={<ProtectedRoute><InDevelopment title="Diseños" /></ProtectedRoute>} />
          
          {/* Redirigir cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
