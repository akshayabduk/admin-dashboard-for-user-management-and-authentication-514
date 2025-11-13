import React, { useEffect, useState } from 'react';
import Api from '../services/api';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Admin dashboard landing showing current user context. */
  const [me, setMe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Api.me().then((data) => { if (mounted) setMe(data); }).catch((e) => setError(e.message));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="card card-pad">
        <h2 className="title" style={{ fontSize: 22 }}>Dashboard</h2>
        <p className="subtitle">Overview and quick actions.</p>
        {error && <div style={{ color: 'var(--error)' }}>{error}</div>}
        <div className="row">
          <div className="card card-pad" style={{ flex: 1, minWidth: 220 }}>
            <div className="text-muted">Signed in user</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{me ? (me.email || me.username || 'Unknown') : '—'}</div>
          </div>
          <div className="card card-pad" style={{ flex: 1, minWidth: 220 }}>
            <div className="text-muted">Passkeys</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{me?.passkeyCount ?? '—'}</div>
          </div>
          <div className="card card-pad" style={{ flex: 1, minWidth: 220 }}>
            <div className="text-muted">Status</div>
            <div style={{ fontWeight: 700, marginTop: 6, color: 'var(--success)' }}>Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}
