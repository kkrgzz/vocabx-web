// EncryptionHelper.js

import CryptoJS from 'crypto-js';

/**
 * A helper class for performing symmetric encryption (AES) and decryption
 * using crypto-js, with key derivation (PBKDF2).
 */
class EncryptionHelper {
    /**
     * Creates an instance of EncryptionHelper.
     * @param {object} [options] - Configuration options.
     * @param {number} [options.keySize=256] - Key size in bits (e.g., 128, 192, 256). Default is 256.
     * @param {number} [options.iterations=10000] - Number of iterations for PBKDF2. Default is 10000.
     * @param {CryptoJS.algo} [options.hasher=CryptoJS.algo.SHA256] - Hashing algorithm for PBKDF2.
     * @param {CryptoJS.mode} [options.mode=CryptoJS.mode.CBC] - AES mode of operation.
     * @param {CryptoJS.pad} [options.padding=CryptoJS.pad.Pkcs7] - AES padding scheme.
     */
    constructor(options = {}) {
        this.keySize = (options.keySize || 256) / 32; // Size in 32-bit words
        this.iterations = options.iterations || 10000;
        this.hasher = options.hasher || CryptoJS.algo.SHA256;
        this.mode = options.mode || CryptoJS.mode.CBC;
        this.padding = options.padding || CryptoJS.pad.Pkcs7;
        // Salt and IV size (in bytes). 16 bytes (128 bits) is common for both.
        this.saltSize = 128 / 8;
        this.ivSize = 128 / 8; // AES block size is 128 bits, so IV is typically 128 bits for modes like CBC.
                                // Note: For GCM mode (if used), a 96-bit (12-byte) IV is recommended.
    }

    /**
     * Derives a cryptographic key from a password and salt using PBKDF2.
     * @param {string} password - The password to derive the key from.
     * @param {CryptoJS.lib.WordArray} salt - The salt (as a WordArray).
     * @returns {CryptoJS.lib.WordArray} The derived key (as a WordArray).
     * @private
     */
    _deriveKey(password, salt) {
        if (!password || !salt) {
            throw new Error("Password and salt are required for key derivation.");
        }
        return CryptoJS.PBKDF2(password, salt, {
            keySize: this.keySize,
            iterations: this.iterations,
            hasher: this.hasher
        });
    }

    /**
     * Encrypts plaintext content using AES.
     * Generates a random salt and IV for each encryption.
     * @param {string} plaintext - The content to encrypt.
     * @param {string} password - The password used to derive the encryption key.
     * @returns {{salt: string, iv: string, ciphertext: string}|null} An object containing the salt (hex), iv (hex),
     *          and ciphertext (base64), or null if encryption fails.
     */
    encrypt(plaintext, password) {
        if (!plaintext || !password) {
            console.error("Plaintext and password are required for encryption.");
            return null;
        }
        try {
            // 1. Generate random Salt and IV
            const salt = CryptoJS.lib.WordArray.random(this.saltSize);
            const iv = CryptoJS.lib.WordArray.random(this.ivSize);

            // 2. Derive Key
            const key = this._deriveKey(password, salt);

            // 3. Encrypt
            const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: this.mode,
                padding: this.padding
            });

            // 4. Return components in storable formats
            return {
                salt: salt.toString(CryptoJS.enc.Hex),
                iv: iv.toString(CryptoJS.enc.Hex),
                // Use ciphertext property for the raw encrypted data, encode as Base64
                ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
            };
        } catch (error) {
            console.error("Encryption failed:", error);
            return null;
        }
    }

    /**
     * Decrypts ciphertext using AES.
     * Requires the original salt, IV, ciphertext, and the correct password.
     * @param {{salt: string, iv: string, ciphertext: string}} encryptedData - An object containing hex salt, hex iv, and base64 ciphertext.
     * @param {string} password - The password used for the original encryption.
     * @returns {string|null} The original plaintext, or null if decryption fails (e.g., wrong password, corrupted data).
     */
    decrypt(encryptedData, password) {
        if (!encryptedData || !encryptedData.salt || !encryptedData.iv || !encryptedData.ciphertext || !password) {
            console.error("Encrypted data object (with salt, iv, ciphertext) and password are required for decryption.");
            return null;
        }

        try {
            // 1. Parse Salt, IV, and Ciphertext from stored formats
            const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
            const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
            // Parse Base64 ciphertext into a WordArray
            const ciphertext = CryptoJS.enc.Base64.parse(encryptedData.ciphertext);

            // 2. Derive the *same* Key
            const key = this._deriveKey(password, salt);

            // 3. Decrypt
            // We need to provide the ciphertext in a way AES.decrypt understands when components are separate.
            // We pass a CipherParams object containing the ciphertext WordArray.
            const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
                iv: iv,
                mode: this.mode,
                padding: this.padding
            });

            // 4. Convert result to UTF-8 string
            const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

            // 5. Check if decryption was successful (empty string might indicate failure)
            if (!plaintext) {
                 // This often happens with incorrect password/key or corrupted data
                throw new Error("Decryption resulted in empty data. Likely wrong password or data corruption.");
            }

            return plaintext;
        } catch (error) {
            console.error("Decryption failed:", error);
            // Don't return potentially garbage data on error
            return null;
        }
    }
}

export default EncryptionHelper;

