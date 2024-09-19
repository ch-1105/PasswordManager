import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
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
      <SafeAreaView style={styles.container}>
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>密码详情</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditPassword', { id })}>
          <Icon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>标题:</Text>
          <Text style={styles.value}>{passwordData.title}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>用户名:</Text>
          <Text style={styles.value}>{passwordData.username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>密码:</Text>
          <Text style={styles.value}>{passwordData.password}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>分类:</Text>
          <Text style={styles.value}>{passwordData.category}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>备注:</Text>
          <Text style={styles.value}>{passwordData.note}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>删除密码</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333333',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordDetailScreen;
