import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import CustomFontText from './CustomFontText';

const TopNav = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Left side (empty) */}
      <View style={styles.emptySpace} />

      {/* Center logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Wal<Text style={{color: '#fa9654'}}>Fit</Text></Text>
      </View>

      {/* Right profile button */}
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <FontAwesomeIcon icon={faPhone} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    height: 90,
    paddingHorizontal: 15,
    paddingTop: '8%',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  emptySpace: {
    flex: 1,
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
  },
  profileButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopNav;
