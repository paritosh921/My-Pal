// News.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const News = () => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://inshorts.com/en/read' }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default News;
