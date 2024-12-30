import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Animated, Alert, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GROQ_API_KEY = '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';

const ChatScreen = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [switchPosition, setSwitchPosition] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('chatMessages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error('Failed to load messages from AsyncStorage', error);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to AsyncStorage', error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    const promptMessage = language === 'en'
      ? 'Always speak in English. Be a helpful friend—ask questions to start the conversation. Keep responses natural and friendly. Keep responses short (max 80 words, ideally under 40).'
      : 'Always speak in Hindi. Be a helpful friend—ask questions to start the conversation. Keep responses natural and friendly. Keep responses short (max 80 words, ideally under 40).';

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-70b-versatile',
          messages: [
            { role: 'system', content: promptMessage },
            ...messages,
            userMessage
          ],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = { role: 'assistant', content: response.data.choices[0].message.content || 'No response from bot' };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error: Unable to fetch response.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setUserInput('');
  };

  const toggleLanguage = (newLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      Animated.spring(switchPosition, {
        toValue: newLanguage === 'en' ? 0 : 1,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLongPress = (item, index) => {
    if (selectedMessages.includes(index)) {
      setSelectedMessages(selectedMessages.filter(id => id !== index));
    } else {
      setSelectedMessages([...selectedMessages, index]);
    }
    setShowDeleteButton(selectedMessages.length > 0 || selectedMessages.length === 1);
  };

  const handleDeleteMessages = () => {
    Alert.alert(
      "Delete Selected Messages",
      "Are you sure you want to delete the selected messages?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const updatedMessages = messages.filter((_, index) => !selectedMessages.includes(index));
            setMessages(updatedMessages);
            setSelectedMessages([]);
            setShowDeleteButton(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const toggleKeyboard = () => {
    setIsKeyboardVisible(!isKeyboardVisible);
    if (!isKeyboardVisible) {
      inputRef.current.focus();
    }
  };

  const handleSymbolPress = (symbol) => {
    setUserInput(prevText => prevText + symbol);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Toggle */}
      <View style={styles.languageToggleContainer}>
        <View style={styles.languageToggleBackground}>
          <Animated.View
            style={[styles.toggleCircle, {
              transform: [{
                translateX: switchPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 45],
                })
              }]
            }]} />
          <TouchableOpacity
            style={[styles.languageToggleButton, language === 'en' && styles.selectedLanguageButton]}
            onPress={() => toggleLanguage('en')}
          >
            <Text style={styles.languageButtonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageToggleButton, language === 'hi' && styles.selectedLanguageButton]}
            onPress={() => toggleLanguage('hi')}
          >
            <Text style={styles.languageButtonText}>हिंदी</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item, index)}
              style={[
                item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                selectedMessages.includes(index) && styles.selectedMessage,
              ]}
            >
              <Text style={[item.role === 'user' ? styles.userMessage : styles.botMessage]}>
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Text Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder={language === 'en' ? "Type a message" : "संदेश टाइप करें"}
            placeholderTextColor={'#bbb'}
            multiline={true}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keyboardButton} onPress={toggleKeyboard}>
            <Text style={styles.keyboardButtonText}>
              {isKeyboardVisible ? 'Hide Keyboard' : 'Math'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        {showDeleteButton && (
          <View style={styles.deleteButtonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMessages}>
              <Text style={styles.deleteButtonText}>Delete Selected</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Math Keyboard Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isKeyboardVisible}
        onRequestClose={toggleKeyboard}
      >
        <View style={styles.modalContainer}>
          <View style={styles.keyboardContainer}>
            <View style={styles.symbolSection}>
              {[
                '√', 'π', 'e', '^', '∫', '∑', '∏', '∞',
                '≠', '≈', '≤', '≥', 'sin', 'cos', 'tan', 'log', 'ln','0','1','2','3','4','5','6','7','8','9'
              ].map((symbol, index) => (
                <TouchableOpacity key={index} onPress={() => handleSymbolPress(symbol)} style={styles.symbolButton}>
                  <Text style={styles.symbolButtonText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.operatorSection}>
              {[
                '(', ')', '+', '-', '*', '/', '=', '.','^'
              ].map((symbol, index) => (
                <TouchableOpacity key={index} onPress={() => handleSymbolPress(symbol)} style={styles.operatorButton}>
                  <Text style={styles.operatorButtonText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={toggleKeyboard}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', justifyContent: 'flex-end' },
  userMessageContainer: {
    alignSelf: 'flex-end',
    padding: 12,
    margin: 6,
    borderRadius: 20,
    maxWidth: '80%',
    marginBottom: 10,
    backgroundColor: '#333',
    shadowColor: '#333',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    padding: 12,
    margin: 6,
    borderRadius: 20,
    maxWidth: '80%',
    marginBottom: 10,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  selectedMessage: {
    backgroundColor: '#d3d3d3',
  },
  userMessage: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: '#fff',
  },
  botMessage: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#2A3335',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A3335',
    borderRadius: 25,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#118B50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  keyboardButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 10,
  },
  keyboardButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  languageToggleContainer: {
    padding: 10,
    backgroundColor: '#181818',
  },
  languageToggleBackground: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 25,
    padding: 5,
    width: 170,
    justifyContent: 'space-between',
  },
  languageToggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  selectedLanguageButton: {
    backgroundColor: '#118B50',
  },
  toggleCircle: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#181818',
  },
  languageButtonText: {
    color: '#118B50',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#118B50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    padding: 10,
    alignItems: 'center',
    marginBottom: 150, // Ensure there is space for the input box
  },
  symbolSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  symbolButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  symbolButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  operatorSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  operatorButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#5DB996',
  },
  operatorButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChatScreen;
