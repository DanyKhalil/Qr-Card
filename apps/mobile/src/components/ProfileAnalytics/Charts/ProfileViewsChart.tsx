import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const ProfileViewsChart = ({ data, chartType, dateRange }) => {
    const screenWidth = Dimensions.get('window').width - 40; // accounting for padding

    const getChartTitle = () => {
        const titles = {
            'today': 'Profile Views Today (Hourly)',
            '7days': 'Profile Views - Last 7 Days',
            '30days': 'Profile Views - Last 30 Days',
            'year': 'Profile Views - Last Year'
        };
        return titles[dateRange] || 'Profile Views';
    };

    // Transform data for react-native-chart-kit
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.visits || 0),
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 133, 89, ${opacity})`, // #FF8559
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#FF8559',
        },
        propsForLabels: {
            fontSize: 10,
        },
    };

    // Calculate height based on data length for better visibility
    const chartHeight = Math.max(300, data.length * 20);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getChartTitle()}</Text>
            
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={true}
                style={styles.chartScrollView}
            >
                <View style={styles.chartContainer}>
                    {chartType === 'bar' ? (
                        <BarChart
                            data={chartData}
                            width={Math.max(screenWidth, data.length * 50)} // Dynamic width based on data points
                            height={chartHeight}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars={true}
                            fromZero={true}
                        />
                    ) : (
                        <LineChart
                            data={chartData}
                            width={Math.max(screenWidth, data.length * 50)} // Dynamic width based on data points
                            height={chartHeight}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                            bezier // Smooth lines
                            fromZero={true}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    chartScrollView: {
        borderRadius: 8,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
};

export default ProfileViewsChart;