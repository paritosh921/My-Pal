import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av'; // Import Audio from expo-av

export default function VoiceAssistenceScreen() {
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      const { status } = await Audio.requestPermissionsAsync(); // Request microphone permission
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required for this app to function properly.');
      }
    };

    requestMicrophonePermission();
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}
      <WebView
        source={{ uri: 'https://llm-saint.vercel.app/' }} // Your desired URL
        style={styles.webview}
        onLoadEnd={() => setLoading(false)} // Set loading to false when the page has finished loading
        javaScriptEnabled={true} // Enable JavaScript
        domStorageEnabled={true} // Enable DOM storage
        startInLoadingState={true} // Show loading indicator while loading
        mixedContentMode="always"
        mediaPlaybackRequiresUserAction={false} // Allow mixed content
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
});