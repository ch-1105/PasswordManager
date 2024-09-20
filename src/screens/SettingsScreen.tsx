import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatabaseService from '../services/DatabaseService';
import CryptoService from '../services/CryptoService';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

const settingsOptions = [
  { id: 'export', title: '导出密码', icon: 'arrow-up-circle-outline' },
  { id: 'import', title: '导入密码', icon: 'arrow-down-circle-outline' },
  { id: 'about', title: '关于软件', icon: 'information-circle-outline' },
];

function SettingsScreen() {
  const navigation = useNavigation();

  const handleExport = async () => {
    try {
      const passwords = await DatabaseService.getPasswords();
      const encryptedData = await CryptoService.encrypt(JSON.stringify(passwords));
      const fileName = `passwords_${new Date().getTime()}.enc`;

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          const uri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/octet-stream');
          await FileSystem.writeAsStringAsync(uri, encryptedData, { encoding: FileSystem.EncodingType.UTF8 });
          Alert.alert('导出成功', `密码导出成功！\n文件保存在: ${uri}`);
        } else {
          Alert.alert('权限错误', '未授予权限，无法保存文件。');
        }
      } else {
        // iOS 的处理逻辑
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, encryptedData, { encoding: FileSystem.EncodingType.UTF8 });
        Alert.alert('导出成功', `密码导出成功！\n文件保存在应用文档目录中: ${fileName}`);
      }
    } catch (error) {
      console.error('导出失败', error);
      Alert.alert('导出失败', '请重试。');
    }
  };

  const handleImport = async () => {
    try {
      // console.log('Starting import process');
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/octet-stream' });
      // console.log('Document picker result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        // console.log('Selected file:', file);
        
        // console.log('Reading file content');
        const encryptedData = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
        // console.log('Encrypted data length:', encryptedData.length);
        
        // console.log('Decrypting data');
        const decryptedData = await CryptoService.decrypt(encryptedData);
        // console.log('Decrypted data length:', decryptedData.length);
        
        // console.log('Parsing JSON');
        const importedPasswords = JSON.parse(decryptedData);
        console.log('Imported passwords count:', importedPasswords.length);
        
        console.log('Importing passwords to database');
        const { imported, duplicates } = await DatabaseService.importPasswordsWithDuplicateCheck(importedPasswords);
        
        Alert.alert('导入结果', `成功导入 ${imported} 个新密码，${duplicates} 个重复密码被跳过。`);
      } else {
        console.log('Document picker cancelled or no file selected');
      }
    } catch (error) {
      console.error('Import failed:', error);
      Alert.alert('导入失败', '请确保文件格式正确。');
    }
  };

  const handleOptionPress = (id) => {
    switch (id) {
      case 'export':
        handleExport();
        break;
      case 'import':
        handleImport();
        break;
      case 'about':
        // 暂时留空，未来可以添加关于软件的页面导航
        break;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionPress(item.id)}>
      <Icon name={item.icon} size={24} color="#7892B5" style={styles.optionIcon} />
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={settingsOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#8CB9C0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default SettingsScreen;
