import React, { useEffect, useState } from 'react';
import Api from '../services/api';

// PUBLIC_INTERFACE
export default function Users() {
  /** Users admin page to enable/disable login. */
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setError(null);
      const data = await Api.users();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load users');
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    setBusyId(u.id);
    try {
      await Api.toggleUser(u.id, !u.enabled);
      await load();
    } catch (e) {
      setError(e.message || 'Toggle failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="card card-pad">
      <h2 className="title" style={{ fontSize: 22 }}>Users</h2>
      <p className="subtitle">Manage access and account status.</p>
      {error && <div style={{ color: 'var(--error)' }}>{error}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Display</th>
              <th>Enabled</th>
              <th>Passkeys</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id}>
                <td>{u.email || u.username}</td>
                <td>{u.displayName || '—'}</td>
                <td>{String(u.enabled)}</td>
                <td>{u.passkeyCount ?? '—'}</td>
                <td>
                  <button className="btn" disabled={busyId === u.id} onClick={() => toggle(u)}>
                    {u.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="text-muted">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
