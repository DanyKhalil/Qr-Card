import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileAnalyticsApi } from '../../services/profileAnalyticsApi.js';
import { processDateRangeData, processScanTypeData } from "./analyticsDataProcessing.js";
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import ProfileViewsChart from './Charts/ProfileViewsChart.jsx';
import ScanTypeChart from './Charts/ScanTypeChart.jsx';
import './ProfileAnalytics.css';

const ProfileAnalytics = () => {
  const { id } = useParams();
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
    fetchProfileAnalytics(id);
  }, [id]);

  const processedViewsData = processDateRangeData(analyticsData, dateRange);
  const processedScanData = processScanTypeData(analyticsData, dateRange);

  if (loading) {
    return (
      <div className="profile-analytics">
        <Header />
        <div className="loading-container">
          <p>Loading analytics...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-analytics">
        <Header />
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => fetchProfileAnalytics(id)}>Retry</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-analytics">
      <Header />
      
      <div className="analytics-container">
        <h1>Profile Analytics</h1>
        
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Date Range:</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="pretty-select"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Views Chart:</label>
            <select 
              value={viewsChartType} 
              onChange={(e) => setViewsChartType(e.target.value)}
              className="pretty-select"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Scan Chart:</label>
            <select 
              value={scanChartType} 
              onChange={(e) => setScanChartType(e.target.value)}
              className="pretty-select"
            >
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <ProfileViewsChart 
            data={processedViewsData}
            chartType={viewsChartType}
            dateRange={dateRange}
          />
          
          <ScanTypeChart 
            data={processedScanData}
            chartType={scanChartType}
            dateRange={dateRange}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileAnalytics;