import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

function PasswordListScreen() {
  const navigation = useNavigation();
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadPasswords();
      loadTags();
    }, [])
  );

  const loadPasswords = async () => {
    try {
      const data = await DatabaseService.getPasswords();
      setPasswords(data);
      setFilteredPasswords(data);
    } catch (error) {
      console.error('Failed to load passwords', error);
    }
  };

  const loadTags = async () => {
    try {
      const allTags = await DatabaseService.getAllTags();
      setTags(allTags);
    } catch (error) {
      console.error('Failed to load tags', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPasswords(passwords);
    } else {
      const searchResults = await DatabaseService.searchPasswords(query);
      setFilteredPasswords(searchResults);
    }
  };

  const handleTagFilter = async (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredPasswords(passwords);
    } else {
      setSelectedTag(tag);
      const taggedPasswords = await DatabaseService.getPasswordsByTag(tag);
      setFilteredPasswords(taggedPasswords);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PasswordDetail', { id: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );

  const renderTagItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tagItem, selectedTag === item && styles.selectedTagItem]}
      onPress={() => handleTagFilter(item)}
    >
      <Text style={[styles.tagText, selectedTag === item && styles.selectedTagText]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="输入标题来进行搜索密码..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        horizontal
        data={tags}
        renderItem={renderTagItem}
        keyExtractor={(item) => item}
        style={styles.tagList}
      />
      <FlatList
        data={filteredPasswords}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  tagList: {
    maxHeight: 50,
    marginBottom: 10,
  },
  tagItem: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedTagItem: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#333',
  },
  selectedTagText: {
    color: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
  },
  category: {
    fontSize: 14,
    color: '#888',
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
