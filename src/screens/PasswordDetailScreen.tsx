import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function PasswordDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  // 临时数据,后续会替换为实际的数据获取逻辑
  const passwordData = {
    title: '示例密码',
    username: 'user@example.com',
    password: '********',
    category: '个人',
    note: '这是一个示例密码的备注。',
  };

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
});

export default PasswordDetailScreen;
