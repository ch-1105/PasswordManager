import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

function PasswordListScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const data = await DatabaseService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadPasswordsByCategory = async (category) => {
    try {
      const data = await DatabaseService.getPasswordsByCategory(category);
      setPasswords(data);
    } catch (error) {
      console.error('Failed to load passwords', error);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    loadPasswordsByCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (selectedCategory) {
      const filteredPasswords = passwords.filter(password => 
        password.title.toLowerCase().includes(query.toLowerCase())
      );
      setPasswords(filteredPasswords);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item && styles.selectedCategoryItem]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderPasswordItem = ({ item }) => (
    <TouchableOpacity
      style={styles.passwordItem}
      onPress={() => navigation.navigate('PasswordDetail', { id: item.id })}
    >
      <Text style={styles.passwordTitle}>{item.title}</Text>
      <Text style={styles.passwordUsername}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        style={styles.categoryList}
      />
      {selectedCategory && (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索密码..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={passwords}
            renderItem={renderPasswordItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditPassword')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryList: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedCategoryItem: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  passwordItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordUsername: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default PasswordListScreen;
