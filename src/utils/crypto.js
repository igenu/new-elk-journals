import CryptoJS from 'crypto-js';

const SECRET_KEY = 'papersearch-secret-key'; // In production, use environment variable

export const encryptId = (id) => {
    if (id === null || id === undefined) return '';
    const ciphertext = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // Standard Base64URL: + -> -, / -> _, = -> empty
    return ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const decryptId = (encryptedId) => {
    if (!encryptedId) return '';
    try {
        // Revert Base64URL: - -> +, _ -> /
        let ciphertext = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (ciphertext.length % 4) {
            ciphertext += '=';
        }
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || null;
    } catch (error) {
        console.error('Error decrypting ID:', error);
        return null;
    }
};
