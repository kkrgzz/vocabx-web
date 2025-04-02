import crypto from 'crypto';

class EncryptionHelper {
  constructor(password) {
    this.password = password;
  }

  encrypt(data) {
    const salt = crypto.randomBytes(16).toString('hex');
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.password, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: `${iv.toString('hex')}:${encrypted}`, salt };
  }

  decrypt(encryptedData, salt) {
    const [ivHex, encryptedText] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(this.password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export default EncryptionHelper;