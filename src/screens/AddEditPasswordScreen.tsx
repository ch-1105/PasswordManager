import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

function AddEditPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (id) {
      loadPassword();
    }
  }, [id]);

  const loadPassword = async () => {
    try {
      const passwordData = await DatabaseService.getPasswordById(id);
      setTitle(passwordData.title);
      setUsername(passwordData.username);
      setPassword(passwordData.password);
      setCategory(passwordData.category);
      setNote(passwordData.note);
      setTags(passwordData.tags.join(', '));
    } catch (error) {
      console.error('加载密码失败', error);
      Alert.alert('错误', '加载密码失败');
    }
  };

  const handleSave = async () => {
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const passwordData = { 
        title, 
        username, 
        password, 
        category, 
        note, 
        tags: tagArray 
      };
      if (id) {
        await DatabaseService.updatePassword({ id, ...passwordData });
      } else {
        await DatabaseService.addPassword(passwordData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('保存密码失败', error);
      Alert.alert('错误', '保存密码失败');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="标题"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="分类"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="备注"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="标签 (用逗号分隔)"
        value={tags}
        onChangeText={setTags}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddEditPasswordScreen;
