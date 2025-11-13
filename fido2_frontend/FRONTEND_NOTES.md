# FIDO2 Frontend - Setup Notes

## Environment
Create a .env file in this folder based on .env.example:

REACT_APP_API_BASE_URL=http://localhost:3001

## Install
npm install

## Run
npm start

## Build
npm run build

## Routes
- /login - WebAuthn sign-in and QR login
- /register - Passkey registration
- /dashboard - Admin dashboard (requires backend session)
- /users - Users management

## WebAuthn
WebAuthn helper handles Base64URL conversions when calling:
- navigator.credentials.create
- navigator.credentials.get

See src/services/webauthn.js

## API Client
Uses REACT_APP_API_BASE_URL for backend. See src/services/api.js.
