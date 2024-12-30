import React from 'react';
import { Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get the screen width

const DailyCard = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ExplorePage')} style={styles.touchableContainer}>
            <ImageBackground
                source={{ uri: 'https://img.freepik.com/free-vector/blue-abstract-background_1393-339.jpg?t=st=1735467058~exp=1735470658~hmac=db5edcf087835340b4459978e9e302553e47c74fa6bf16d89099cfd8f7aebad5&w=900' }}
                style={styles.container}
                imageStyle={styles.image}
            >
                <Text style={styles.title}>Diarization🔊 </Text>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        width: width * 0.42, // Slightly smaller than full width
        height: width * 0.55, // Maintain a consistent aspect ratio
        borderRadius: 20,
        margin: 5,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 100,
        borderWidth: 0.5,
        borderColor: '#3b82f6',
        overflow: 'hidden', // Ensures rounded borders apply to the image
        bottom: 31.5,
    },
    image: {
        borderRadius: 20,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center', // Centers the text
    },
    arrowText: {
        fontSize: 21,
        color: '#3b82f6',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginVertical: 5,
        textAlign: 'center', // Centers the text
    },
});

export default DailyCard;
