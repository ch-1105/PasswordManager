# PasswordManager

PasswordManager 是一个简单的密码管理应用，支持密码的导入和导出功能，并在导入过程中进行去重处理。

## 功能

- **导出密码**：将密码数据加密后导出到用户选择的位置。
- **导入密码**：从加密文件中导入密码数据，并在导入过程中进行去重处理。
- **去重逻辑**：在导入过程中，检查数据库中是否已经存在相同的标题、用户名和密码的记录，避免重复导入。

## 安装

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/yourusername/PasswordManager.git
   cd PasswordManager
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 安装 Expo CLI（如果尚未安装）：
   ```bash
   npm install -g expo-cli
   ```

4. 启动项目：
   ```bash
   expo start
   ```

## 使用

### 导出密码

1. 打开应用并导航到设置页面。
2. 点击“导出密码”选项。
3. 在 Android 上，选择保存位置；在 iOS 上，文件会被保存到应用的文档目录中。
4. 导出成功后，会显示文件保存路径。

### 导入密码

1. 打开应用并导航到设置页面。
2. 点击“导入密码”选项。
3. 选择之前导出的加密文件。
4. 导入过程中会检查是否存在重复的密码，并跳过重复的记录。
5. 导入完成后，会显示导入结果，包括新导入的密码数量和被跳过的重复密码数量。

## 代码结构

- `App.tsx`：应用的入口文件，初始化数据库并设置导航容器。
- `src/navigation/AppNavigator.tsx`：定义应用的导航结构。
- `src/screens/SettingsScreen.tsx`：设置页面，包含导入和导出功能。
- `src/services/DatabaseService.ts`：数据库服务，包含密码的增删改查和导入导出逻辑。
- `src/services/CryptoService.ts`：加密服务，包含数据的加密和解密逻辑。

## 依赖

- `expo`: ^44.0.0
- `expo-file-system`: ^13.0.3
- `expo-document-picker`: ^10.0.3
- `react-native-crypto-js`: ^1.0.0
- `@react-navigation/native`: ^6.1.1
- `@react-navigation/stack`: ^6.2.1
- `react-native-vector-icons`: ^9.0.0

## 贡献

欢迎贡献代码！请 fork 本仓库并提交 pull request。

## 许可证

MIT License
