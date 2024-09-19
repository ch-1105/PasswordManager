import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatabaseService from '../services/DatabaseService';

function PasswordListScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
      loadPasswords();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const data = await DatabaseService.getCategories();
      // 确保 '全部' 和 '默认' 类别只出现一次
      const uniqueCategories = ['全部', ...new Set(['默认', ...data])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadPasswords = async (category = '全部') => {
    try {
      let data;
      if (category === '全部') {
        data = await DatabaseService.getPasswords();
      } else {
        data = await DatabaseService.getPasswordsByCategory(category);
      }
      setPasswords(data);
    } catch (error) {
      console.error('Failed to load passwords', error);
      Alert.alert('错误', '加载密码失败');
      setPasswords([]);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    loadPasswords(category);
  };

  const renderCategoryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item && styles.selectedCategoryItem]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderPasswordItem = ({ item }) => {
    if (!item || !item.title) {
      return null; // 如果项目无效，不渲染任何内容
    }
    return (
      <TouchableOpacity
        style={styles.passwordItem}
        onPress={() => navigation.navigate('AddEditPassword', { id: item.id })}
      >
        <View style={styles.passwordIcon}>
          <Text style={styles.passwordIconText}>{item.title[0].toUpperCase()}</Text>
        </View>
        <View style={styles.passwordInfo}>
          <Text style={styles.passwordTitle}>{item.title}</Text>
          <Text style={styles.passwordUsername}>{item.username}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#BDBDBD" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>密码管理器</Text>
      </View>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={passwords}
        renderItem={renderPasswordItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.passwordList}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditPassword')}
      >
        <Icon name="add" size={30} color="#FFFFFF" />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  categoryList: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedCategoryItem: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333333',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  passwordList: {
    flex: 1,
  },
  passwordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  passwordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  passwordIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordInfo: {
    flex: 1,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  passwordUsername: {
    fontSize: 14,
    color: '#757575',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PasswordListScreen;
