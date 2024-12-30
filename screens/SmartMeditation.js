import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SmartMeditation = () => {
  const [isInhale, setIsInhale] = useState(true);
  const [cyclesLeft, setCyclesLeft] = useState(10);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [phaseTimer, setPhaseTimer] = useState(5);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const breathScale = useRef(new Animated.Value(1)).current;

  // Breathing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, {
          toValue: 1.2,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(breathScale, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/images/meditation.mp3'));
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      audioRef.current = sound;
    };

    loadSound();

    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const toggleSound = async () => {
      if (audioRef.current) {
        if (isSoundOn) {
          await audioRef.current.playAsync();
        } else {
          await audioRef.current.pauseAsync();
        }
      }
    };

    toggleSound();
  }, [isSoundOn]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset phase timer to 5 seconds
    setPhaseTimer(5);

    // Start a new interval to count down
    timerRef.current = setInterval(() => {
      setPhaseTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // When timer reaches 0, switch phase
          setIsInhale((prev) => !prev);

          // Decrement cycles when moving from exhale to inhale
          if (!isInhale) {
            setCyclesLeft((prev) => Math.max(0, prev - 1));
          }

          // Reset timer
          return 10;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInhale]);

  // Stop intervals when cycles are complete
  useEffect(() => {
    if (cyclesLeft === 0 && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [cyclesLeft]);

  const handleSoundToggle = () => {
    setIsSoundOn(!isSoundOn);
  };

  // Use focus effect to handle audio playback based on screen focus state
  useFocusEffect(
    React.useCallback(() => {
      const toggleAudio = async (isFocused) => {
        if (audioRef.current) {
          if (isFocused && isSoundOn) {
            await audioRef.current.playAsync();
          } else {
            await audioRef.current.pauseAsync();
          }
        }
      };

      toggleAudio(true); // Play audio when the screen is focused

      return () => {
        toggleAudio(false); // Pause audio when the screen is blurred
      };
    }, [isSoundOn])
  );

  return (
    <LinearGradient
      colors={['#8A2BE2', '#4B0082']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mindful Breathing 🧘‍♀️</Text>

        {/* Sound Toggle Button */}
        <TouchableOpacity onPress={handleSoundToggle} style={styles.soundButton}>
          <Ionicons
            name={isSoundOn ? "volume-medium" : "volume-mute"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Timer Section */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{phaseTimer}s</Text>
        <Text style={styles.phaseText}>
          {isInhale ? '🫁 Inhaling...' : '😌 Exhaling...'}
        </Text>
      </View>

      {/* Breathing Circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: breathScale }],
            backgroundColor: isInhale ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'
          }
        ]}
      >
        <Text style={styles.breathText}>
          {isInhale ? 'Breathe In' : 'Breathe Out'}
        </Text>
      </Animated.View>

      {/* Cycles Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.cyclesLeft}>🔄 {cyclesLeft} cycles left</Text>

        {cyclesLeft === 0 && (
          <Text style={styles.completedText}>
            🎉 Meditation Complete! Great job! 🌟
          </Text>
        )}
      </View>

      {/* Motivational Quote */}
      {cyclesLeft > 0 && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Breathe in peace, breathe out tension" 🕊️
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  soundButton: {
    padding: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: 120,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  phaseText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  breathText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  cyclesLeft: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
  quoteContainer: {
    position: 'absolute',
    bottom: 70,
    paddingHorizontal: 20,
  },
  quoteText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SmartMeditation;
