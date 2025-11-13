function base64urlToBuffer(base64url) {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url.replace(/-/g, '+').replace(/_/g, '/')) + padding;
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return buffer;
}

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// PUBLIC_INTERFACE
export async function createCredential(publicKeyOptions) {
  /** Calls navigator.credentials.create for registration after converting options. */
  if (!publicKeyOptions || !publicKeyOptions.publicKey) throw new Error('Invalid options');
  const opts = { ...publicKeyOptions.publicKey };

  // Convert challenge and user.id to ArrayBuffer
  if (typeof opts.challenge === 'string') opts.challenge = base64urlToBuffer(opts.challenge);
  if (opts.user && typeof opts.user.id === 'string') opts.user.id = base64urlToBuffer(opts.user.id);

  // Convert excludeCredentials ids
  if (Array.isArray(opts.excludeCredentials)) {
    opts.excludeCredentials = opts.excludeCredentials.map((cred) => ({
      ...cred,
      id: typeof cred.id === 'string' ? base64urlToBuffer(cred.id) : cred.id,
    }));
  }

  const cred = await navigator.credentials.create({ publicKey: opts });
  if (!cred) throw new Error('Creation returned null');

  const response = cred.response;
  return {
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      attestationObject: bufferToBase64url(response.attestationObject),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
    },
  };
}

// PUBLIC_INTERFACE
export async function getAssertion(publicKeyOptions) {
  /** Calls navigator.credentials.get for login after converting options. */
  if (!publicKeyOptions || !publicKeyOptions.publicKey) throw new Error('Invalid options');
  const opts = { ...publicKeyOptions.publicKey };

  if (typeof opts.challenge === 'string') opts.challenge = base64urlToBuffer(opts.challenge);

  if (Array.isArray(opts.allowCredentials)) {
    opts.allowCredentials = opts.allowCredentials.map((cred) => ({
      ...cred,
      id: typeof cred.id === 'string' ? base64urlToBuffer(cred.id) : cred.id,
    }));
  }

  const assertion = await navigator.credentials.get({ publicKey: opts });
  if (!assertion) throw new Error('Assertion returned null');

  const response = assertion.response;
  return {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
    },
  };
}
