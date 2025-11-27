import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { profileAnalyticsApi } from '../../services/profileAnalyticsApi';
import { processDateRangeData, processScanTypeData } from "./analyticsDataProcessing.js";
import ProfileViewsChart from './Charts/ProfileViewsChart';
import ScanTypeChart from './Charts/ScanTypeChart';
import ProfileVisitsTable from './ProfileVisitsTable/ProfileVisitsTable';

const ProfileAnalytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dateRange, setDateRange] = useState('7days');
  const [viewsChartType, setViewsChartType] = useState('bar');
  const [scanChartType, setScanChartType] = useState('pie');

  const fetchProfileAnalytics = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileAnalyticsApi.getUserProfileAnalytics(id);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfileAnalytics(userId);
    }
  }, [userId]);

  const filterVisitsByDateRange = (visits, range) => {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return visits.filter(visit => 
      new Date(visit.visit_date_time) >= startDate
    );
  };

  const processedViewsData = processDateRangeData(analyticsData, dateRange);
  const processedScanData = processScanTypeData(analyticsData, dateRange);
  const filteredVisits = filterVisitsByDateRange(analyticsData, dateRange);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8559" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchProfileAnalytics(userId)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.analyticsContainer}>
          <Text style={styles.title}>Profile Analytics</Text>
          
          {/* Filters Section */}
          <View style={styles.filtersSection}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Date Range:</Text>
              <View style={styles.pickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.pickerOptions}>
                    {['today', '7days', '30days', 'year'].map((range) => (
                      <TouchableOpacity
                        key={range}
                        style={[
                          styles.pickerOption,
                          dateRange === range && styles.pickerOptionSelected
                        ]}
                        onPress={() => setDateRange(range)}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          dateRange === range && styles.pickerOptionTextSelected
                        ]}>
                          {range === 'today' ? 'Today' : 
                           range === '7days' ? '7 Days' :
                           range === '30days' ? '30 Days' : 'Year'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.chartTypeGroup}>
              <View style={styles.chartTypeOption}>
                <Text style={styles.filterLabel}>Views Chart:</Text>
                <View style={styles.chartTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      viewsChartType === 'bar' && styles.chartTypeButtonSelected
                    ]}
                    onPress={() => setViewsChartType('bar')}
                  >
                    <Text style={[
                      styles.chartTypeButtonText,
                      viewsChartType === 'bar' && styles.chartTypeButtonTextSelected
                    ]}>
                      Bar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      viewsChartType === 'line' && styles.chartTypeButtonSelected
                    ]}
                    onPress={() => setViewsChartType('line')}
                  >
                    <Text style={[
                      styles.chartTypeButtonText,
                      viewsChartType === 'line' && styles.chartTypeButtonTextSelected
                    ]}>
                      Line
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.chartTypeOption}>
                <Text style={styles.filterLabel}>Scan Chart:</Text>
                <View style={styles.chartTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      scanChartType === 'pie' && styles.chartTypeButtonSelected
                    ]}
                    onPress={() => setScanChartType('pie')}
                  >
                    <Text style={[
                      styles.chartTypeButtonText,
                      scanChartType === 'pie' && styles.chartTypeButtonTextSelected
                    ]}>
                      Pie
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      scanChartType === 'bar' && styles.chartTypeButtonSelected
                    ]}
                    onPress={() => setScanChartType('bar')}
                  >
                    <Text style={[
                      styles.chartTypeButtonText,
                      scanChartType === 'bar' && styles.chartTypeButtonTextSelected
                    ]}>
                      Bar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Charts Grid */}
          <View style={styles.chartsGrid}>
            <ProfileViewsChart 
              data={processedViewsData}
              chartType={viewsChartType}
              dateRange={dateRange}
            />
            
            <ScanTypeChart 
              data={processedScanData}
              chartType={scanChartType}
            />
          </View>
        </View>

        <ProfileVisitsTable visits={filteredVisits} dateRange={dateRange}/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  analyticsContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  filtersSection: {
    backgroundColor: '#d3f8dc',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontWeight: '600',
    fontSize: 13,
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9e4dd',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  pickerOptionSelected: {
    backgroundColor: '#FFAE91',
    borderColor: '#FF8559',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3748',
  },
  pickerOptionTextSelected: {
    color: '#2d3748',
  },
  chartTypeGroup: {
    gap: 15,
  },
  chartTypeOption: {
    gap: 8,
  },
  chartTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  chartTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9e4dd',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  chartTypeButtonSelected: {
    backgroundColor: '#FFAE91',
    borderColor: '#FF8559',
  },
  chartTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3748',
  },
  chartTypeButtonTextSelected: {
    color: '#2d3748',
  },
  chartsGrid: {
    gap: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

// Responsive styles
const { width } = Dimensions.get('window');

if (width <= 768) {
  styles.chartsGrid = {
    ...styles.chartsGrid,
    flexDirection: 'column',
  };
  
  styles.analyticsContainer = {
    ...styles.analyticsContainer,
    padding: 16,
    paddingTop: 100,
  };
  
  styles.filtersSection = {
    ...styles.filtersSection,
    padding: 16,
  };
}

export default ProfileAnalytics;