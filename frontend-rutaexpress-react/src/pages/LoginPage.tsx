import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { DEMO_USERS } from '../auth/AuthContext';

export function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (currentUser) {
    navigate('/dashboard');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const loginRapido = (u: string, p: string) => {
    login(u, p);
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '60px auto' }}>
        <h2 style={{ textAlign: 'center' }}>RutaExpress</h2>
        <p style={{ textAlign: 'center' }}>Plataforma de envíos de última milla</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row" style={{ flexDirection: 'column' }}>
            <label>Usuario
              <input value={username} onChange={e => setUsername(e.target.value)} autoFocus />
            </label>
            <label>Contraseña
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
          </div>
          {error && <p className="error-box">{error}</p>}
          <button className="btn" type="submit" style={{ width: '100%' }}>Iniciar sesión</button>
        </form>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Acceso rápido con usuarios de prueba (login básico, sin Azure AD todavía):
        </p>
        <div className="form-row">
          {DEMO_USERS.map(u => (
            <button
              key={u.username}
              className="btn secondary"
              onClick={() => loginRapido(u.username, u.password)}
              type="button"
            >
              {u.roles[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
