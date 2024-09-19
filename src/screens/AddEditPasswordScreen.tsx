import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadCategories();
    if (id) {
      loadPassword();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await DatabaseService.getCategories();
      // 确保 '默认' 类别只出现一次，并且在列表开头
      const uniqueCategories = ['默认', ...new Set(data.filter(cat => cat !== '默认'))];
      setCategories(uniqueCategories);
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

  const renderCategoryItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <Text style={styles.categoryItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{id ? '编辑密码' : '新增密码'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Icon name="document-text-outline" size={20} color="#7892B5" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="标题"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#7892B5"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#7892B5" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="用户名"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#7892B5"
          />
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={toggleShowPassword} style={styles.inputIcon}>
            <Icon 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#7892B5" 
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#7892B5"
          />
        </View>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setShowCategoryModal(true)}>
          <Icon name="folder-outline" size={20} color="#7892B5" style={styles.inputIcon} />
          <Text style={styles.categoryButtonText}>{category || '选择类别'}</Text>
          <Icon name="chevron-down" size={20} color="#7892B5" />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Icon name="create-outline" size={20} color="#7892B5" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="备注"
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor="#7892B5"
          />
        </View>
      </ScrollView>
      
      <Modal visible={showCategoryModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>选择类别</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.categoryList}
          />
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={styles.newCategoryInput}
              placeholder="新建类别"
              value={newCategory}
              onChangeText={setNewCategory}
              placeholderTextColor="#000000"
            />
            <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
              <Text style={styles.addCategoryButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000000',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  categoryButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#8CB9C0',
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryList: {
    flex: 1,
    padding: 20,
  },
  categoryItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  categoryItemText: {
    fontSize: 16,
    color: '#000000',
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: '#000000',
  },
  addCategoryButton: {
    backgroundColor: '#EDCA7F',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addCategoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEditPasswordScreen;
