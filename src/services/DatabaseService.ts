import * as SQLite from 'expo-sqlite';

interface Password {
  id?: number;
  title: string;
  username: string;
  password: string;
  category: string;
  note: string;
}

class DatabaseService {
  private static db: SQLite.SQLiteDatabase;

  static async initDatabase(): Promise<void> {
    if (!this.db) {
      console.log('Opening database connection...');
      this.db = await SQLite.openDatabaseAsync('passwords.db');
      console.log('Database connection opened');
      
      console.log('Creating passwords table if not exists...');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS passwords (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          username TEXT,
          password TEXT,
          category TEXT,
          note TEXT
        )
      `);
      console.log('Passwords table created or already exists');
    } else {
      console.log('Database already initialized');
    }
  }

  static async addPassword(password: Password): Promise<number> {
    const result = await this.db.runAsync(
      'INSERT INTO passwords (title, username, password, category, note) VALUES (?, ?, ?, ?, ?)',
      [password.title, password.username, password.password, password.category, password.note]
    );
    return result.lastInsertRowId;
  }

  static async getPasswords(): Promise<Password[]> {
    const passwords = await this.db.getAllAsync('SELECT * FROM passwords WHERE title IS NOT NULL');
    return passwords.map(this.sanitizePassword);
  }

  static async getPasswordById(id: number): Promise<Password> {
    const password = await this.db.getFirstAsync('SELECT * FROM passwords WHERE id = ?', id);
    if (!password) {
      throw new Error('Password not found');
    }
    return password;
  }

  static async updatePassword(password: Password): Promise<void> {
    await this.db.runAsync(
      'UPDATE passwords SET title = ?, username = ?, password = ?, category = ?, note = ? WHERE id = ?',
      [password.title, password.username, password.password, password.category, password.note, password.id]
    );
  }

  static async deletePassword(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM passwords WHERE id = ?', id);
  }

  static async getCategories(): Promise<string[]> {
    const result = await this.db.getAllAsync('SELECT DISTINCT category FROM passwords');
    const categories = result.map(item => item.category).filter(category => category !== null && category !== '');
    return ['默认', ...new Set(categories.filter(cat => cat !== '默认'))];
  }

  static async addCategory(category: string): Promise<void> {
    // 这里我们只是确保类别存在于密码表中
    await this.db.runAsync(
      'INSERT OR IGNORE INTO passwords (category) VALUES (?)',
      [category]
    );
  }

  static async getPasswordsByCategory(category: string): Promise<Password[]> {
    const passwords = await this.db.getAllAsync('SELECT * FROM passwords WHERE category = ? AND title IS NOT NULL', [category]);
    return passwords.map(this.sanitizePassword);
  }

  private static sanitizePassword(password: any): Password {
    return {
      id: password.id,
      title: password.title || '',
      username: password.username || '',
      password: password.password || '',
      category: password.category || '默认',
      note: password.note || ''
    };
  }

  static async importPasswordsWithDuplicateCheck(passwords: Password[]): Promise<{ imported: number, duplicates: number }> {
    console.log('Starting database import with duplicate check');
    await this.initDatabase(); // 确保数据库已初始化
    
    let imported = 0;
    let duplicates = 0;
    
    for (const password of passwords) {
      try {
        // 检查是否存在重复
        const existingPassword = await this.db.getFirstAsync<Password>(
          'SELECT * FROM passwords WHERE title = ? AND username = ? AND password = ?',
          [password.title, password.username, password.password]
        );
        
        if (!existingPassword) {
          // 如果不存在重复，则插入新记录
          await this.db.runAsync(
            'INSERT INTO passwords (title, username, password, category, note) VALUES (?, ?, ?, ?, ?)',
            [password.title, password.username, password.password, password.category, password.note]
          );
          imported++;
        } else {
          duplicates++;
        }
      } catch (error) {
        console.error('Error importing password:', password.title, error);
      }
    }
    
    console.log(`Database import completed. Imported: ${imported}, Duplicates: ${duplicates}`);
    return { imported, duplicates };
  }

  static async importPasswords(passwords: Password[]): Promise<void> {
    console.log('Starting database import');
    await this.initDatabase(); // 确保数据库已初始化
    for (const password of passwords) {
      try {
        await this.db.runAsync(
          'INSERT OR REPLACE INTO passwords (title, username, password, category, note) VALUES (?, ?, ?, ?, ?)',
          [password.title, password.username, password.password, password.category, password.note]
        );
        // console.log('Imported password:', password.title);
      } catch (error) {
        console.error('Error importing password:', password.title, error);
      }
    }
    console.log('Database import completed');
  }
}

export default DatabaseService;
