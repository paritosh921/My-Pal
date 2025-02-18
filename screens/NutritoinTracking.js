import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoodDetailsModal from '../components/FoodDetailsModal';
import debounce from 'lodash/debounce';
import { LinearGradient } from 'expo-linear-gradient';

const fetchImageDataAsBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64;
  } catch (error) {
    console.error('Error fetching image data:', error);
    return null;
  }
};

const sendImageToGeminiAPI = async (imageUri) => {
  const apiKey = 'API Key here';
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const img = {
      inlineData: {
        data: await fetchImageDataAsBase64(imageUri),
        mimeType: 'image/jpeg',
      },
    };
    const prompt = 'Analyze the image of food and provide the estimated value of the food in a JSON response with the following format only and only: {"name": "<food name>", "calories": <number>, "carbohydrate": <number>, "fat": <number>, "protein": <number>, "micronutrients": "<list of micronutrients>", "description": "<food description>"}';
    const result = await model.generateContent([img, prompt]);
    const response = await result.response;
    const text = await response.text();
    try {
      const lines = text.split('\n');
      const cleanedResponse = lines.slice(1, -1).join('\n');
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error sending image to Gemini API:', error);
    return null;
  }
};

const addFoodData = (nutritionData, imageUri) => {
  const newFoodItem = {
      id: (filteredFoods.length + 1).toString(),
      name: nutritionData.name,
      calories: nutritionData.calories,
      fat: nutritionData.fat,
      carbohydrate: nutritionData.carbohydrate,
      protein: nutritionData.protein,
      micronutrients: nutritionData.micronutrients,
      description: nutritionData.description,
      image: imageUri,
      timestamp: new Date().toISOString(),
  };

  const updatedFoods = [...allFoods, newFoodItem];
  setAllFoods(updatedFoods);
  setFilteredFoods(updatedFoods);
  saveFoodData(updatedFoods); // This saves data for DonutChartScreen
};



const FoodScreen = ({ route }) => {
  const [searchText, setSearchText] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Today');
  const { imageUri } = route.params || {};

  useEffect(() => {
    loadFoodData();
  }, []);

  useEffect(() => {
    if (imageUri) {
      pickImage(imageUri);
    }
  }, [imageUri]);

  const loadFoodData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('foodData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAllFoods(parsedData);
        setFilteredFoods(parsedData);
      }
    } catch (error) {
      console.error('Error loading food data:', error);
      Alert.alert('Error', 'Failed to load food data. Please try again.');
    }
  };

  const saveFoodData = async (data) => {
    try {
      await AsyncStorage.setItem('foodData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving food data:', error);
      Alert.alert('Error', 'Failed to save food data. Please try again.');
    }
  };

  const pickImage = async (uri) => {
    try {
      let imageUri = uri;

      if (!uri) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
          const resizedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7 }
          );
          imageUri = resizedImage.uri;
        } else {
          return;
        }
      }

      setIsLoading(true);
      const nutritionData = await sendImageToGeminiAPI(imageUri);
      setIsLoading(false);

      if (nutritionData) {
        addFoodData(nutritionData, imageUri);
        handleFoodPress(nutritionData);
      } else {
        Alert.alert('Error', 'Failed to analyze the image.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addFoodData = (nutritionData, imageUri) => {
    const newFoodItem = {
      id: (filteredFoods.length + 1).toString(),
      name: nutritionData.name,
      calories: nutritionData.calories,
      fat: nutritionData.fat,
      carbohydrate: nutritionData.carbohydrate,
      protein: nutritionData.protein,
      micronutrients: nutritionData.micronutrients,
      description: nutritionData.description,
      image: imageUri,
      timestamp: new Date().toISOString(),
    };

    const updatedFoods = [...allFoods, newFoodItem];
    setAllFoods(updatedFoods);
    setFilteredFoods(updatedFoods);
    saveFoodData(updatedFoods);
  };

  const handleSearch = debounce((text) => {
    setSearchText(text);
    const filtered = allFoods.filter((food) =>
      food.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFoods(filtered);
  }, 300);

  const handleFoodPress = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    const currentDate = new Date();
    let filtered = [...allFoods];

    switch (filter) {
      case 'Today':
        filtered = filtered.filter((food) => {
          const foodDate = new Date(food.timestamp);
          return (
            foodDate.getFullYear() === currentDate.getFullYear() &&
            foodDate.getMonth() === currentDate.getMonth() &&
            foodDate.getDate() === currentDate.getDate()
          );
        });
        break;

      case 'Yesterday':
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        filtered = filtered.filter((food) => {
          const foodDate = new Date(food.timestamp);
          return (
            foodDate.getFullYear() === yesterday.getFullYear() &&
            foodDate.getMonth() === yesterday.getMonth() &&
            foodDate.getDate() === yesterday.getDate()
          );
        });
        break;

      case 'This Week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = filtered.filter((food) => {
          const foodDate = new Date(food.timestamp);
          return foodDate >= weekStart && foodDate <= weekEnd;
        });
        break;

      case 'Set Duration':
        Alert.alert('Coming Soon', 'Custom date range feature will be available soon!');
        return;
    }

    setFilteredFoods(filtered);
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => handleFoodPress(item)}
      accessibilityLabel={`Select food item ${item.name}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
        style={styles.foodItemGradient}
      >
        <Image source={{ uri: item.image }} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{item.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{item.carbohydrate}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{item.fat}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{item.protein}g</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#000000']}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        {['Today', 'Yesterday', 'This Week', 'Set Duration'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => handleFilter(filter)}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === filter && styles.activeFilterButtonText,
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Analyzing your food...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedFood && (
        <FoodDetailsModal
          visible={modalVisible}
          food={selectedFood}
          onClose={closeModal}
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => pickImage(null)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.fabGradient}
        >
          <Text style={styles.fabButtonText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  foodItem: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodItemGradient: {
    flexDirection: 'row',
    padding: 16,
  },
  foodImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
  },
  nutritionValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: '5%',
    bottom: '12%',
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  fabButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodScreen;
