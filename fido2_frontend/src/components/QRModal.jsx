import React, { useEffect, useState } from 'react';
import Api from '../services/api';

// PUBLIC_INTERFACE
export default function QRModal({ open, onClose }) {
  /** Modal that initiates QR flow and polls status. */
  const [token, setToken] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    async function start() {
      try {
        setError(null);
        setStatus('starting');
        const startRes = await Api.qrStart();
        // Expecting startRes to include token and optionally qrImage data URL or URL
        const t = startRes?.token;
        setToken(t || null);
        setQrUrl(startRes?.qr || startRes?.qrUrl || null);
        setStatus('waiting');
        interval = setInterval(async () => {
          try {
            const s = await Api.qrStatus(t);
            if (s?.status === 'approved' || s?.authenticated) {
              setStatus('approved');
              clearInterval(interval);
              // redirect or notify success
              window.location.href = '/dashboard';
            } else if (s?.status === 'expired') {
              setStatus('expired');
              clearInterval(interval);
            }
          } catch (e) {
            setError(e.message || 'Polling error');
          }
        }, 1500);
      } catch (e) {
        setError(e.message || 'Failed to start QR flow');
        setStatus('error');
      }
    }
    if (open) start();
    return () => interval && clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>Scan QR to Continue</strong>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <div className="center">
            {qrUrl ? (
              <img src={qrUrl} alt="Login QR" style={{ width: 220, height: 220, borderRadius: 12, border: '1px solid var(--border)' }} />
            ) : (
              <div className="card card-pad" style={{ width: 220, height: 220 }} />
            )}
          </div>
          <div className="mt-16 text-muted">
            Status: {status}{token ? ` • Token: ${token.slice(0, 6)}…` : ''}
          </div>
          {error && <div className="mt-16" style={{ color: 'var(--error)' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
