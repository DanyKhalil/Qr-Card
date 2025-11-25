import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileAnalyticsApi } from '../../services/profileAnalyticsApi.js';
import { processDateRangeData, processScanTypeData } from "./analyticsDataProcessing.js";
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import ProfileViewsChart from './Charts/ProfileViewsChart.jsx';
import ScanTypeChart from './Charts/ScanTypeChart.jsx';
import './ProfileAnalytics.css';
import ProfileVisitsTable from './ProfileVisitsTable/ProfileVisitsTable.jsx';

const ProfileAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dateRange, setDateRange] = useState('7days');
  const [viewsChartType, setViewsChartType] = useState('bar');
  const [scanChartType, setScanChartType] = useState('pie');

  // this function returns the token of the logged in user
    const getToken = () => {
        return localStorage.getItem("token");
    };
    // and this returns the user logged in
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };
    
    const currentLoggedInUser = getCurrentUser();
    const { id: urlId } = useParams(); // get visiting user id 
    const id = urlId || currentLoggedInUser?.id; // either a visiting id or a current logged in id
    if (!id) {
        window.location.href = "/login";
        return null;
    }

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

      <ProfileVisitsTable visits={filteredVisits} dateRange={dateRange}/>
      
      <Footer />
    </div>
  );
};

export default ProfileAnalytics;