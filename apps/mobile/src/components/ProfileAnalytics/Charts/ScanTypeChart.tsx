import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const ScanTypeChart = ({ data, chartType }) => {
    const screenWidth = Dimensions.get('window').width - 40;
    const COLORS = ['#FF8559', '#82C294'];

    // Transform data for bar chart
    const barChartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.value || 0),
            },
        ],
    };

    // Transform data for pie chart
    const pieChartData = data.map((item, index) => ({
        name: item.name,
        population: item.value || 0,
        color: COLORS[index % COLORS.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(130, 194, 148, ${opacity})`, // #82C294 for bar chart
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForLabels: {
            fontSize: 10,
        },
    };

    const barChartConfig = {
        ...chartConfig,
        color: (opacity = 1) => `rgba(130, 194, 148, ${opacity})`, // Green color for bars
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Visit Types</Text>
            
            {chartType === 'pie' ? (
                <View style={styles.pieChartContainer}>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute // Shows absolute values instead of percentages
                    />
                    {/* Custom legend */}
                    <View style={styles.legendContainer}>
                        {data.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View 
                                    style={[
                                        styles.legendColor, 
                                        { backgroundColor: COLORS[index % COLORS.length] }
                                    ]} 
                                />
                                <Text style={styles.legendText}>
                                    {item.name}: {item.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={true}
                    style={styles.chartScrollView}
                >
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={barChartData}
                            width={Math.max(screenWidth, data.length * 60)}
                            height={300}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={barChartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars={true}
                            fromZero={true}
                        />
                    </View>
                </ScrollView>
            )}
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
    pieChartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
    legendContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
};

export default ScanTypeChart;