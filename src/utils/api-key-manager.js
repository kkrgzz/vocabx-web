import EncryptionHelper from "./encryption-helper";


class ApiKeyManager {
  constructor() {
    // App-level secret from environment variables
    this.encryptionSecret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-app-secret';
    this.cryptoHelper = new EncryptionHelper({ iterations: 10000 });
  }

  encrypt(apiKey) {
    if (!apiKey) return null;
    return this.cryptoHelper.encrypt(apiKey, this.encryptionSecret);
  }

  decrypt(encryptedData) {
    if (!encryptedData) return null;
    return this.cryptoHelper.decrypt(encryptedData, this.encryptionSecret);
  }
}

export default new ApiKeyManager();