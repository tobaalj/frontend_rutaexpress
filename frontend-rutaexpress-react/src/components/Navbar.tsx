import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useRoles } from '../auth/useRoles';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { displayName, roles, hasAnyRole } = useRoles();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="brand">RutaExpress</div>

      {currentUser ? (
        <>
          <div className="links">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            {hasAnyRole(['Admin', 'Operador', 'Cliente']) && (
              <NavLink to="/shipments" className={linkClass}>Envíos</NavLink>
            )}
            {hasAnyRole(['Admin', 'Operador']) && (
              <NavLink to="/catalog" className={linkClass}>Catálogo</NavLink>
            )}
            {hasAnyRole(['Admin']) && <NavLink to="/reports" className={linkClass}>Reportería</NavLink>}
            {hasAnyRole(['Admin', 'Auditor']) && (
              <NavLink to="/audit" className={linkClass}>Auditoría</NavLink>
            )}
          </div>
          <div className="user">
            <span className="who">{displayName}</span>
            {roles.map(r => (
              <span key={r} className="badge">{r}</span>
            ))}
            <button className="btn secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </>
      ) : (
        <NavLink to="/login" className="btn">Iniciar sesión</NavLink>
      )}
    </nav>
  );
}
