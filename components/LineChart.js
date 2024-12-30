// LineChart.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const LineChartComponent = () => {
    // Dummy data for the line chart
    const data = [1700, 1750, 1720, 1738, 1813, 1694, 1748]; // Data points for each day

    const contentInset = { top: 20, bottom: 20 }; // Adjust the content inset for the line chart

    // Days of the week for the X-axis
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                {/* Y Axis */}
                <YAxis
                    data={data}
                    contentInset={contentInset}
                    svg={{
                        fill: '#ffffff',
                        fontSize: 10,
                    }}
                    numberOfTicks={3} // Decreased number of ticks on Y axis
                    formatLabel={(value) => `${value}`} // Format the label
                />
                {/* Line Chart */}
                <View style={styles.lineChartContainer}>
                    <LineChart
                        style={styles.chart}
                        data={data}
                        svg={{ stroke: '#00FF00', strokeWidth: 1 }} // Line color and thickness
                        contentInset={contentInset}
                        curve={shape.curveLinear} // Set the curve of the line
                    >
                    </LineChart>
                    {/* X Axis */}
                    <XAxis
                        style={styles.xAxis}
                        data={data}
                        svg={{
                            fill: '#ffffff',
                            fontSize: 10,
                        }}
                        numberOfTicks={daysOfWeek.length} // Number of ticks on X axis
                        formatLabel={(value, index) => daysOfWeek[index]} // Format the label with day names
                    />
                </View>
            </View>
            <Text style={styles.title}>Your Week Graph</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20, // Space around the container
        width: '100%', // Slightly smaller than full width
        height: '100%', // Adjust height to control vertical space
        backgroundColor: '#000',
        borderRadius: 20, // Rounded borders
        margin: 20,
        shadowColor: '#00FF00',
        shadowOffset: { width: 100, height: 100 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
        borderWidth:0.5,
    borderColor:'#00FF00',
    bottom:'22%',
    top:'-15%',
    },
    chartContainer: {
        flexDirection: 'row',
        height: '100%',
    },
    lineChartContainer: {
        flex: 1,
        paddingRight: 16, // Space for X axis
    },
    chart: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color:'#3b82f6',
        fontFamily:'Roborto-2-Bold'
    },
    xAxis: {
        marginHorizontal: -10, // Adjust margin to fit the X Axis
    },
});

export default LineChartComponent;
