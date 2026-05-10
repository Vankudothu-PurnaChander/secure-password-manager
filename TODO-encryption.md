# Password Encryption Upgrade - TODO (AES + Master Key)

## Plan Overview:
Client encrypts pw with master pw-derived key before API. Server stores cipher-text. Client decrypts on retrieve.

## Steps:
### 1. ⬜ Install crypto-js (both)
   `cd frontend/backend && npm i crypto-js`

### 2. ⬜ Update backend passdatacontroller.js
   - Remove bcrypt for data pw (store encrypted as-is)
   - UpdateData: no compare, just update cipher

### 3. ⬜ Frontend: Add master pw state (App.jsx or Context)
### 4. ⬜ Update Profile.jsx: Forms for add/view/decrypt
### 5. ⬜ api.js: Encrypt before POST, decrypt after GET

**Master key: PBKDF2 from user master password (login asks for it to decrypt vault).**

**Next: Install deps.**
