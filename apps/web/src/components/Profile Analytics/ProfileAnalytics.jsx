import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { processDailyVisits, processHourlyVisits, processScanTypes, processLast7Days } from "./analyticsDataProcessing.js"
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import { useState } from 'react';


const ProfileAnalytics = () => {

  const [analyticsData, setAnalyticsData] = useState([
    {
        "id": "987e3cab-d450-4cbf-ae8b-ae32358b57fb",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:56.000Z",
        "created_at": "2025-11-06T22:20:56.000Z"
    },
    {
        "id": "52e1dd11-5c76-4783-9925-c11b57087e2f",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:55.000Z",
        "created_at": "2025-11-06T22:20:55.000Z"
    },
    {
        "id": "a31cd9d9-83e7-482f-8567-0aaec4f2d706",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:54.000Z",
        "created_at": "2025-11-06T22:20:54.000Z"
    },
    {
        "id": "5c370823-422f-4bd7-89fb-09e63808baf9",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:53.000Z",
        "created_at": "2025-11-06T22:20:53.000Z"
    },
    {
        "id": "bc1617ad-3510-44d8-8117-5e3d1b820630",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:52.000Z",
        "created_at": "2025-11-06T22:20:52.000Z"
    },
    {
        "id": "31edc8a6-0271-4311-9aad-ec21e0d9e8e4",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:51.000Z",
        "created_at": "2025-11-06T22:20:51.000Z"
    },
    {
        "id": "adc60334-e712-425c-bed7-a19cdc7bf791",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:50.000Z",
        "created_at": "2025-11-06T22:20:50.000Z"
    },
    {
        "id": "0842ae61-aba4-47bd-b12e-da9c816e3bb7",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:49.000Z",
        "created_at": "2025-11-06T22:20:49.000Z"
    },
    {
        "id": "fafd6e6e-6d28-46be-a2e8-42c5b02bd8d4",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:47.000Z",
        "created_at": "2025-11-06T22:20:47.000Z"
    },
    {
        "id": "53a32c52-8b86-4e88-b66b-ad2d4adef38f",
        "profile_id": "profile001",
        "qr_scan": false,
        "visit_date_time": "2025-11-06T22:20:42.000Z",
        "created_at": "2025-11-06T22:20:42.000Z"
    }
  ]);
  const [processedData, setProcessedData] = useState({
          dailyVisits: processDailyVisits(analyticsData),
          hourlyVisits: processHourlyVisits(analyticsData),
          scanTypes: processScanTypes(analyticsData),
          last7Days: processLast7Days(analyticsData)
        });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  if (analyticsData.length === 0) return <div>Loading analytics...</div>;

  
  return (    
    <div>
      <Header/>
      {/* <Camera/> */}<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <BarChart width={600} height={300} data={processedData.hourlyVisits}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#82ca9d" />
        </BarChart>
      <Footer/>
    </div>
  )
}

export default ProfileAnalytics
