import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../services/api';
import { createCredential } from '../services/webauthn';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page using WebAuthn attestation. */
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const options = await Api.beginRegistration(username, displayName || username);
      const attestation = await createCredential(options);
      await Api.finishRegistration(attestation);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card card-pad">
        <h1 className="title">Create account</h1>
        <p className="subtitle">Register your passkey to enable secure, passwordless sign-in.</p>
        <form onSubmit={handleRegister}>
          <label className="label" htmlFor="username">Username</label>
          <input id="username" className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="you@example.com" required />
          <div className="mt-16" />
          <label className="label" htmlFor="displayName">Display name</label>
          <input id="displayName" className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
          {error && <div className="mt-16" style={{ color: 'var(--error)' }}>{error}</div>}
          <div className="row mt-24">
            <button className="btn" type="submit" disabled={busy || !username}>
              {busy ? 'Creating…' : 'Register Passkey'}
            </button>
            <a className="btn secondary" href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
