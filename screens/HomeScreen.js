import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Component imports
import ProgressChartWithLegends from '../components/ChartWithLegend';
import Meter from '../components/meter';
import DailyCard from '../components/DailyCard';
import LineChartComponent from '../components/LineChart';

// Constants
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const LOGO_HEIGHT = SCREEN_HEIGHT * 0.06;
const SCROLL_MARGIN_TOP = SCREEN_HEIGHT * 0.08;
const BOTTOM_PADDING = Platform.OS === 'ios' ? 90 : 70;

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/mypal.png')} 
          style={styles.logo}
          resizeMode="contain"
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Chart */}
        <View style={styles.chartSection}>
          <ProgressChartWithLegends />
        </View>

        {/* Meter and Daily Card Row */}
        <View style={styles.middleSection}>
          <View style={styles.meterContainer}>
            <Meter />
          </View>
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation.navigate('Dirization')}
          >
            <DailyCard />
          </TouchableOpacity>
        </View>

        {/* Line Chart */}
        <View style={styles.lineChartSection}>
          <LineChartComponent />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: BOTTOM_PADDING }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layout styles
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    marginTop: SCROLL_MARGIN_TOP,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Logo styles
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: LOGO_HEIGHT,
  },
  logo: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT,
  },

  // Section styles
  chartSection: {
    height: SCREEN_HEIGHT * 0.35,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flexDirection: 'row',
    height: SCREEN_HEIGHT * 0.25,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  meterContainer: {
    flex: 1,
    marginRight: 5,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 9,
  },
  lineChartSection: {
    height: SCREEN_HEIGHT * 0.25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;