import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/api';
import { getAssertion } from '../services/webauthn';
import QRModal from '../components/QRModal';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page with WebAuthn and QR login options. */
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const options = await Api.beginLogin(username);
      const assertion = await getAssertion(options);
      await Api.finishLogin(assertion);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card card-pad">
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Sign in using your FIDO2 security key or platform authenticator.</p>
        <form onSubmit={handleLogin}>
          <label className="label" htmlFor="username">Username</label>
          <input id="username" className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="you@example.com" required />
          {error && <div className="mt-16" style={{ color: 'var(--error)' }}>{error}</div>}
          <div className="row mt-24">
            <button className="btn" type="submit" disabled={busy || !username}>
              {busy ? 'Authenticating…' : 'Sign in with Passkey'}
            </button>
            <button type="button" className="btn secondary" onClick={() => setQrOpen(true)}>
              Use QR Login
            </button>
          </div>
        </form>
        <div className="mt-24">
          <span className="text-muted">New here?</span>{' '}
          <a href="/register">Create an account</a>
        </div>
      </div>
      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
