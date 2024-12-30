import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

const WolframMathKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  // Mathematical symbols and functions
  const mathSymbols = [
    '√', 'π', 'e', '^', 
    '∫', '∑', '∏', '∞',
    '≠', '≈', '≤', '≥',
    'sin', 'cos', 'tan', 'log',
    'ln', 'exp', 'mod', 'abs'
  ];

  const operatorSymbols = [
    '(', ')', '+', '-', 
    '*', '/', '=', '.'
  ];

  const handleSymbolPress = (symbol) => {
    setInputText((prevText) => prevText + symbol);
  };

  const toggleKeyboard = () => {
    setIsKeyboardVisible(!isKeyboardVisible);
  };

  return (
    <View style={styles.container}>
      {/* Input Area */}
      <TextInput
        style={styles.input}
        value={inputText}
        placeholder="Enter mathematical expression"
        onChangeText={setInputText}
      />

      {/* Show Keyboard Button */}
      <TouchableOpacity 
        style={styles.showKeyboardButton} 
        onPress={toggleKeyboard}
      >
        <Text style={styles.buttonText}>
          {isKeyboardVisible ? 'Hide Math Keyboard' : 'Show Math Keyboard'}
        </Text>
      </TouchableOpacity>

      {/* Mathematical Keyboard Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isKeyboardVisible}
        onRequestClose={toggleKeyboard}
      >
        <View style={styles.modalContainer}>
          <View style={styles.keyboardContainer}>
            {/* Mathematical Symbols Section */}
            <Text style={styles.sectionHeader}>Mathematical Symbols</Text>
            <View style={styles.symbolSection}>
              {mathSymbols.map((symbol, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.symbolButton}
                  onPress={() => handleSymbolPress(symbol)}
                >
                  <Text style={styles.symbolText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Operators Section */}
            <Text style={styles.sectionHeader}>Operators</Text>
            <View style={styles.operatorSection}>
              {operatorSymbols.map((symbol, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.operatorButton}
                  onPress={() => handleSymbolPress(symbol)}
                >
                  <Text style={styles.operatorText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Close Keyboard Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={toggleKeyboard}
            >
              <Text style={styles.closeButtonText}>Close Keyboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  showKeyboardButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  symbolSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  symbolButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  operatorSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  operatorButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  operatorText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WolframMathKeyboard;
