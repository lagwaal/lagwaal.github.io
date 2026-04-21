import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-in">
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
          <Lock size={24} />
        </div>
        <h1>Admin Panel</h1>
        <p>Enter your password to access the dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default password: admin123</p>
      </div>
    </div>
  );
}
