// this will filter the visits to only incldue the ones in a range
export const processDateRangeData = (analyticsData, dateRange) => {
  const now = new Date();
  let startDate = new Date();

  switch (dateRange) {
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

  const filteredData = analyticsData.filter(visit => 
    new Date(visit.visit_date_time) >= startDate
  );

  if (dateRange === 'today') {
    return processHourlyData(filteredData);
  } else if (dateRange === '7days') {
    return processDailyData(filteredData, 7);
  } else if (dateRange === '30days') {
    return processDailyData(filteredData, 30);
  } else {
    return processMonthlyData(filteredData);
  }
};

// this will show the amount of qr_scans for a date
export const processScanTypeData = (analyticsData, dateRange) => {
  const now = new Date();
  let startDate = new Date();

  switch (dateRange) {
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

  const filteredData = analyticsData.filter(visit => 
    new Date(visit.visit_date_time) >= startDate
  );

  const qrScans = filteredData.filter(visit => visit.qr_scan).length;
  const regularVisits = filteredData.length - qrScans;

  return [
    { name: 'QR Scans', value: qrScans },
    { name: 'Regular Visits', value: regularVisits }
  ];
};


const processHourlyData = (data) => {
  const hourlyCounts = Array(24).fill(0);
  
  data.forEach(visit => {
    const hour = new Date(visit.visit_date_time).getHours();
    hourlyCounts[hour]++;
  });
  
  return hourlyCounts.map((count, hour) => ({
    name: `${hour}:00`,
    visits: count
  }));
};

const processDailyData = (data, days) => {
  const dailyCounts = {};
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString();
    dailyCounts[dateString] = 0;
  }
  
  data.forEach(visit => {
    const dateString = new Date(visit.visit_date_time).toLocaleDateString();
    if (dailyCounts[dateString] !== undefined) {
      dailyCounts[dateString]++;
    }
  });
  
  return Object.entries(dailyCounts).map(([date, visits]) => ({
    name: date,
    visits
  }));
};

const processMonthlyData = (data) => {
  const monthlyCounts = {};
  
  data.forEach(visit => {
    const date = new Date(visit.visit_date_time);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
  });
  
  return Object.entries(monthlyCounts).map(([month, visits]) => ({
    name: month,
    visits
  }));
};