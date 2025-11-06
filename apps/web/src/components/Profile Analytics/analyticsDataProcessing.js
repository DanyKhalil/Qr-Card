export const processDailyVisits = (analyticsData) => {
  const dailyCounts = {};
  
  analyticsData.forEach(visit => {
    const date = new Date(visit.visit_date_time).toLocaleDateString();
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });
  
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    visits: count,
    fullDate: new Date(date)
  })).sort((a, b) => a.fullDate - b.fullDate);
};

export const processHourlyVisits = (analyticsData) => {
  const hourlyCounts = Array(24).fill(0);
  
  analyticsData.forEach(visit => {
    const hour = new Date(visit.visit_date_time).getHours();
    hourlyCounts[hour]++;
  });
  
  return hourlyCounts.map((count, hour) => ({
    hour: `${hour}:00`,
    visits: count,
    hourNumber: hour
  }));
};

export const processScanTypes = (analyticsData) => {
  const qrScans = analyticsData.filter(visit => visit.qr_scan).length;
  const regularVisits = analyticsData.length - qrScans;
  
  return [
    { type: 'QR Scans', count: qrScans },
    { type: 'Regular Visits', count: regularVisits }
  ];
};

export const processLast7Days = (analyticsData) => {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString();
    
    const dayVisits = analyticsData.filter(visit => {
      const visitDate = new Date(visit.visit_date_time).toLocaleDateString();
      return visitDate === dateString;
    }).length;
    
    last7Days.push({
      date: dateString,
      visits: dayVisits,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  
  return last7Days;
};