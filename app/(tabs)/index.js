import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppNavigator from '../../nagivation/AppNavigation';  // Ensure correct import path

const Index = () => {
  return (
    <AppNavigator />  // Directly use AppNavigator without wrapping in View
  );
};

export default Index;

const styles = StyleSheet.create({});
