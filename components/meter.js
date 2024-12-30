import React from 'react';
import { Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get the screen width

const Meter = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('SmartMeditation')}>
            <ImageBackground 
                source={{ uri: 'https://img.freepik.com/free-vector/gradient-colorful-grainy-dynamic-background_52683-101908.jpg' }}
                style={styles.container}
                imageStyle={styles.image}
            >
                <Text style={styles.title}>Meditate 🧘🏻‍♂️</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: width * 0.45, // Set a constant width relative to the screen width
        height: width * 0.52, // Maintain a consistent aspect ratio
        borderRadius: 20,
        margin: 10,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 100,
        borderWidth: 0.5,
        borderColor: '#3b82f6',
        overflow: 'hidden', // Ensures rounded borders apply to the image
        bottom: '18%',
    },
    image: {
        borderRadius: 20,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        textAlign: 'center', // Centers the text
    },
    count: {
        fontSize: 100,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
});

export default Meter;
