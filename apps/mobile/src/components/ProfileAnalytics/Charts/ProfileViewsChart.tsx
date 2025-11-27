import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const ProfileViewsChart = ({ data, chartType, dateRange }) => {
    const screenWidth = Dimensions.get('window').width - 40;

    const getChartTitle = () => {
        const titles = {
            'today': 'Profile Visits Today (Hourly)',
            '7days': 'Profile Visits - Last 7 Days',
            '30days': 'Profile Visits - Last 30 Days',
            'year': 'Profile Visits - Last Year'
        };
        return titles[dateRange] || 'Profile Views';
    };

    // Smart label formatting to prevent overlap
    const formatLabels = (labels) => {
        if (labels.length <= 8) return labels;
        
        // Show fewer labels for better readability
        return labels.map((label, index) => {
            if (index % Math.ceil(labels.length / 6) === 0) {
                // Shorten long labels
                return label.length > 8 ? label.substring(0, 6) + '..' : label;
            }
            return '';
        });
    };

    const chartData = {
        labels: formatLabels(data.map(item => item.name)),
        datasets: [
            {
                data: data.map(item => item.visits || 0),
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#f8f9fb',
        backgroundGradientFrom: '#f8f9fb',
        backgroundGradientTo: '#f8f9fb',
        backgrounColor: "transparent",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 133, 89, ${opacity})`,
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
            fontSize: 9,
        },
        barPercentage: data.length > 10 ? 0.3 : 0.6,
    };

    const chartHeight = Math.max(320, data.length * 25); // Extra height for labels
    const chartWidth = Math.max(screenWidth, data.length * 70);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getChartTitle()}</Text>
            
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={true}
                style={styles.chartScrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.chartContainer}>
                    {chartType === 'bar' ? (
                        <BarChart
                            data={chartData}
                            width={chartWidth}
                            height={chartHeight}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars={true}
                            fromZero={true}
                            withHorizontalLabels={true}
                            withVerticalLabels={true}
                        />
                    ) : (
                        <LineChart
                            data={chartData}
                            width={chartWidth}
                            height={chartHeight}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                            bezier
                            fromZero={true}
                            withHorizontalLabels={true}
                            withVerticalLabels={true}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = {
    container: {
        borderRadius: 12,
        padding: 20,
        marginVertical: 20,
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
    scrollContent: {
        paddingRight: 20,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chart: {
        marginRight: 10,
    },
};

export default ProfileViewsChart;