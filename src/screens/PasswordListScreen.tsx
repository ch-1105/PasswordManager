import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatabaseService from '../services/DatabaseService';

function PasswordListScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const scrollX = React.useRef(new Animated.Value(0)).current;

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

  const renderCategoryItem = ({ item, index }) => {
    const inputRange = [-1, 0, 1];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.categoryItem, selectedCategory === item && styles.selectedCategoryItem]}
        onPress={() => handleCategoryPress(item)}
      >
        <Animated.Text 
          style={[
            styles.categoryText, 
            selectedCategory === item && styles.selectedCategoryText,
            { transform: [{ scale }] }
          ]}
        >
          {item}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const renderPasswordItem = ({ item }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>密码管理器</Text>
      </View>
      <Animated.FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
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
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryList: {
    maxHeight: 50,
    marginVertical: 15,
    backgroundColor: '#F5F5F5',
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#91B5A9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryItem: {
    backgroundColor: '#7892B5',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  passwordList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  passwordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D98481',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  passwordUsername: {
    fontSize: 14,
    color: '#7892B5',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDCA7F',
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
