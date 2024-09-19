import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

function PasswordDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [passwordData, setPasswordData] = useState(null);

  useEffect(() => {
    loadPassword();
  }, [id]);

  const loadPassword = async () => {
    try {
      const data = await DatabaseService.getPasswordById(id);
      setPasswordData(data);
    } catch (error) {
      console.error('加载密码失败', error);
      Alert.alert('错误', '加载密码失败');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      '确认删除',
      '您确定要删除这个密码吗?',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deletePassword(id);
              navigation.goBack();
            } catch (error) {
              console.error('删除密码失败', error);
              Alert.alert('错误', '删除密码失败');
            }
          }
        },
      ]
    );
  };

  if (!passwordData) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>标题:</Text>
      <Text style={styles.value}>{passwordData.title}</Text>

      <Text style={styles.label}>用户名:</Text>
      <Text style={styles.value}>{passwordData.username}</Text>

      <Text style={styles.label}>密码:</Text>
      <Text style={styles.value}>{passwordData.password}</Text>

      <Text style={styles.label}>分类:</Text>
      <Text style={styles.value}>{passwordData.category}</Text>

      <Text style={styles.label}>备注:</Text>
      <Text style={styles.value}>{passwordData.note}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddEditPassword', { id })}
      >
        <Text style={styles.editButtonText}>编辑</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>删除</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PasswordDetailScreen;
