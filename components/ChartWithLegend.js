import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ConcentricDonutChart = ({ rings, totalCalories }) => {
    const center = 100;
    const radius = 80;
    const strokeWidth = 14;
    const borderColors = ['#fa9654', '#3b82f6', '#32cd32'];

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <Svg width={center * 2} height={center * 2}>
                    <G rotation="-90" origin={`${center}, ${center}`}>
                        {rings.map((ring, index) => {
                            const ringRadius = radius - index * (strokeWidth + 5);
                            const circumference = 2 * Math.PI * ringRadius;
                            const strokeDashoffset = circumference - (circumference * ring.percentage) / 100;

                            return (
                                <G key={index}>
                                    <Circle
                                        cx="50%"
                                        cy="50%"
                                        r={ringRadius}
                                        stroke={borderColors[index]}
                                        strokeWidth={2}
                                        fill="transparent"
                                    />
                                    <Circle
                                        cx="50%"
                                        cy="50%"
                                        r={ringRadius}
                                        stroke={ring.color}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                    />
                                </G>
                            );
                        })}
                    </G>
                    <SvgText
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dy="-0.3em"
                        fontSize="20"
                        fill="#fff"
                        fontWeight="bold"
                    > 
                      
                    </SvgText>
                </Svg>
            </View>

            <View style={styles.legendContainer}>
                {rings.map((ring, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: ring.color }]} />
                        <Text style={styles.legendText}>{`${ring.label} ${ring.percentage}%`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const DonutChartScreen = () => {
    const [rings, setRings] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);

    const loadFoodData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('foodData');
            if (storedData) {
                const foodData = JSON.parse(storedData);

                const totalCarbs = foodData.reduce((acc, food) => acc + (food.carbohydrate || 0), 0);
                const totalFat = foodData.reduce((acc, food) => acc + (food.fat || 0), 0);
                const totalProtein = foodData.reduce((acc, food) => acc + (food.protein || 0), 0);
                const totalCal = foodData.reduce((acc, food) => acc + (food.calories || 0), 0);

                const totalCaloriesFromCarbs = totalCarbs * 4;
                const totalCaloriesFromFat = totalFat * 9;
                const totalCaloriesFromProtein = totalProtein * 4;

                const totalNutrientCalories = totalCaloriesFromCarbs + totalCaloriesFromFat + totalCaloriesFromProtein;

                const carbPercentage = ((totalCaloriesFromCarbs / totalNutrientCalories) * 100 || 0).toFixed(1);
                const fatPercentage = ((totalCaloriesFromFat / totalNutrientCalories) * 100 || 0).toFixed(1);
                const proteinPercentage = ((totalCaloriesFromProtein / totalNutrientCalories) * 100 || 0).toFixed(1);

                setRings([
                    { percentage: parseFloat(carbPercentage), color: "#fa9654", label: "Carbs" },
                    { percentage: parseFloat(fatPercentage), color: "#3b82f6", label: "Fat" },
                    { percentage: parseFloat(proteinPercentage), color: "#16a34a", label: "Protein" },
                ]);

                setTotalCalories(totalCal);
            }
        } catch (error) {
            console.error('Error loading food data:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFoodData();
        }, [])
    );

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ConcentricDonutChart rings={rings} totalCalories={totalCalories} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '100%',
        height: '70%',
        backgroundColor: '#000',
        borderRadius: 20,
        margin: 10,
        shadowColor: '#fec89a',
        shadowOffset: { width: 200, height: 200 },
        shadowOpacity: 3,
        shadowRadius: 5,
        elevation: 100,
        borderWidth: 0.5,
        borderColor: '#fec89a'
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: '-1%',
        left: '2%',
        bottom: '5%',
    },
    legendContainer: {
        flex: 1,
        paddingLeft: '2%',
        justifyContent: 'center',
        left: '15%'
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10%',
    },
    colorBox: {
        width: '10%',
        height: '90%',
        marginRight: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 16,
        color: '#fff',
         
    },
});

export default DonutChartScreen;
