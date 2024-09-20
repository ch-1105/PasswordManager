import CryptoJS from 'react-native-crypto-js';

const ENCRYPTION_KEY = 'your_secret_key_here'; // 请使用安全的方式存储这个密钥

const CryptoService = {
  encrypt: async (data: string): Promise<string> => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  },

  decrypt: async (encryptedData: string): Promise<string> => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Decryption failed');
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  },
};

export default CryptoService;
