import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ExplorePage = () => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ngrokUrl, setNgrokUrl] = useState('');

  useEffect(() => {
    const fetchNgrokUrl = async () => {
      try {
        const response = await axios.get('https://dirization-server.onrender.com/current-ngrok'); // Replace with your Node server's IP
        const fetchedUrl = response.data.ngrokUrl;

        console.log('Fetched Ngrok URL:', fetchedUrl);
        setNgrokUrl(fetchedUrl);
      } catch (error) {
        console.error('Failed to fetch Ngrok URL:', error);
      }
    };

    // Fetch the URL initially and every 10 seconds
    fetchNgrokUrl();
    const interval = setInterval(fetchNgrokUrl, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const requestPermissions = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Permission to access the microphone is required.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'An error occurred while requesting permissions.');
      return false;
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      console.log('Recording stopped and saved at:', uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const sendAudioForDiarization = async () => {
    if (!recordingUri) {
      Alert.alert('Error', 'No recording found to process.');
      return;
    }

    if (!ngrokUrl) {
      Alert.alert('Error', 'Server URL is not available. Please try again later.');
      return;
    }

    setIsProcessing(true);
    const url = `${ngrokUrl}/diarize`;
    console.log('Sending audio to:', url);

    const formData = new FormData();
    formData.append('audio_file', {
      uri: recordingUri,
      type: 'audio/wav',
      name: 'recording.wav',
    });

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response);

      if (response.status === 200 && response.data.segments) {
        // Format the transcript data
        const formattedTranscript = response.data.segments.map((segment) => ({
          speaker: segment.speaker.replace('SPEAKER_', 'Speaker '),
          text: segment.text,
          start: segment.start,
          end: segment.end,
        }));

        setTranscript(formattedTranscript);
        console.log('Transcript updated');
      } else {
        console.error('Unexpected response format:', response.data);
        Alert.alert('Error', 'Failed to process audio. Please try again.');
      }
    } catch (error) {
      console.error('Failed to send audio for diarization:', error);
      Alert.alert('Error', 'Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isRecordingActive = !!recording;
  const isDisabled = !recordingUri || isRecordingActive || isProcessing;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Voice Diarization</Text>
        </View>

        <ScrollView
          style={styles.transcriptContainer}
          contentContainerStyle={styles.transcriptContent}
        >
          {transcript.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start recording to see the diarization results.
              </Text>
            </View>
          ) : (
            transcript.map((segment, index) => (
              <View key={index} style={styles.segment}>
                <View style={styles.segmentHeader}>
                  <Text style={styles.speaker}>{segment.speaker}</Text>
                  <Text style={styles.time}>
                    {`${segment.start.toFixed(1)}s - ${segment.end.toFixed(1)}s`}
                  </Text>
                </View>
                <Text style={styles.text}>{segment.text}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[
              styles.button,
              isRecordingActive ? styles.stopButton : styles.startButton,
            ]}
            onPress={isRecordingActive ? stopRecording : startRecording}
          >
            {isRecordingActive ? (
              <MaterialIcons name="mic-off" size={24} color="#fff" />
            ) : (
              <MaterialIcons name="mic" size={24} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isRecordingActive ? 'Recording Started' : 'Start Recording'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.processButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={sendAudioForDiarization}
            disabled={isDisabled}
          >
            {isProcessing ? (
              <FontAwesome name="spinner" size={24} color="#fff" />
            ) : (
              <Entypo name="controller-play" size={24} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : 'Process Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  safeArea: {
    flex: 1,
    paddingBottom: height * 0.12,
  },
  header: {
    padding: 16,
    backgroundColor: '#262626',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginTop: height * 0.0001,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  transcriptContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom controls
  },
  emptyState: {
    flex: 1,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  segment: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#262626',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speaker: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0EA5E9',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  text: {
    fontSize: 15,
    color: '#E5E5E5',
    lineHeight: 22,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    gap: 3,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#059669',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  processButton: {
    backgroundColor: '#0EA5E9',
  },
  disabledButton: {
    backgroundColor: '#404040',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default ExplorePage;
