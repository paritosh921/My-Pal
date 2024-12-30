import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const FoodDetailsModal = ({ visible, onClose, food }) => {
  if (!food) return null; // If no food item is selected, return null

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={{ uri: food.image }} style={styles.foodImage} />
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.nutritionText}>Carbs: {food.carbohydrate}</Text>
          <Text style={styles.nutritionText}>Fat: {food.fat}</Text>
          <Text style={styles.nutritionText}>Protein: {food.protein}</Text>
          <Text style={styles.nutritionText}>Calories: {food.calories}</Text>
          <Text style={styles.micronutrientText}>Micronutrients: {food.micronutrients}</Text>
          <Text style={styles.micronutrientText}>{food.description}</Text>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#fec89a',
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 50,
    borderWidth: 0.5,
    borderColor: '#fec89a'
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff'
  },
  nutritionText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
  },
  micronutrientText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#fa9654',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodDetailsModal;
