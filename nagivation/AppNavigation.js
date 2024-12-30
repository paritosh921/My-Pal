import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, Brain, Telescope, Globe, Newspaper, Salad, AudioLines } from 'lucide-react-native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import NutritoinTracking from '../screens/NutritoinTracking';
import ChatScreen from '../screens/ChatScreen';
import VoiceAssistenceScreen from '../screens/VoiceAssistenceScreen';
import SmartMeditation from '../screens/SmartMeditation';
import ExplorePage from '../screens/ExplorePage';
import News from '../screens/News';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : -10,
          left: SCREEN_WIDTH * 0.1, // 5% margin from each side
          right: SCREEN_WIDTH * 0.1,
          elevation: 0,
          backgroundColor: route.name === 'ChatScreen' ? 'transparent' : '#1A2130', // Set to #FFCCE1 for other screens
          borderRadius: 15,
          height: route.name === 'ChatScreen' ? 0 : Platform.OS === 'ios' ? 80 : 70, // Hide when on ChatScreen
          shadowColor: route.name === 'ChatScreen' ? 'transparent' : '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: route.name === 'ChatScreen' ? 0 : 0.25,
          shadowRadius: 4.84,
          paddingHorizontal: route.name === 'ChatScreen' ? 0 : 10,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? '#007bff' : '#888';
          const iconSize = focused ? 40 : 30;

          switch (route.name) {
            case 'HomeScreen':
              return <Home color={iconColor} size={iconSize} />;
            case 'NutritoinTracking':
              return <Salad color={iconColor} size={iconSize} />;
            case 'ChatScreen':
              return <MessageCircle color={iconColor} size={iconSize} />;
            case 'VoiceAssistenceScreen':
              return <AudioLines color={iconColor} size={iconSize} />;
            case 'SmartMeditation':
              return <Brain color={iconColor} size={iconSize} />;
            case 'ExplorePage':
              return <Telescope color={iconColor} size={iconSize} />;
            case 'News':
              return <Newspaper color={iconColor} size={iconSize} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="NutritoinTracking" component={NutritoinTracking} />
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="VoiceAssistenceScreen" component={VoiceAssistenceScreen} />
      <Tab.Screen name="SmartMeditation" component={SmartMeditation} />
      <Tab.Screen name="ExplorePage" component={ExplorePage} />
      <Tab.Screen name="News" component={News} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
