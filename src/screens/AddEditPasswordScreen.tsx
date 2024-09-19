import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

function AddEditPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('默认');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState(['默认']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadCategories();
    if (id) {
      loadPassword();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await DatabaseService.getCategories();
      setCategories(['默认', ...data]);
    } catch (error) {
      console.error('加载类别失败', error);
    }
  };

  const loadPassword = async () => {
    try {
      const passwordData = await DatabaseService.getPasswordById(id);
      setTitle(passwordData.title);
      setUsername(passwordData.username);
      setPassword(passwordData.password);
      setCategory(passwordData.category);
      setNote(passwordData.note);
    } catch (error) {
      console.error('加载密码失败', error);
      Alert.alert('错误', '加载密码失败');
    }
  };

  const handleSave = async () => {
    try {
      const passwordData = { title, username, password, category, note };
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

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      await DatabaseService.addCategory(newCategory);
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      setNewCategory('');
      setShowCategoryModal(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

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
      <TouchableOpacity style={styles.input} onPress={() => setShowCategoryModal(true)}>
        <Text>{category || '选择类别'}</Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="备注"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>
      
      <Modal visible={showCategoryModal} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
          />
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={[styles.input, styles.newCategoryInput]}
              placeholder="新建类别"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
              <Text style={styles.addCategoryButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowCategoryModal(false)}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  newCategoryInput: {
    flex: 1,
    marginRight: 10,
  },
  addCategoryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddEditPasswordScreen;
