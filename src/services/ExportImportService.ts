import * as CryptoJS from 'crypto-js';
import DatabaseService from './DatabaseService';

class ExportImportService {
  private static readonly ENCRYPTION_KEY = 'your-secret-key-here'; // 在实际应用中,应该更安全地管理这个密钥

  static async exportEncryptedData(): Promise<string> {
    const data = await DatabaseService.exportData();
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  static async importEncryptedData(encryptedData: string): Promise<void> {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    await DatabaseService.importData(decryptedData);
  }
}

export default ExportImportService;
