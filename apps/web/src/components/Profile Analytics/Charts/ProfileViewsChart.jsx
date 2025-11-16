import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfileViewsChart = ({ data, chartType, dateRange }) => {
    const getChartTitle = () => {
        const titles = {
            'today': 'Profile Views Today (Hourly)',
            '7days': 'Profile Views - Last 7 Days',
            '30days': 'Profile Views - Last 30 Days',
            'year': 'Profile Views - Last Year'
        };
        return titles[dateRange] || 'Profile Views';
    };

    const maxVisits = Math.max(...data.map(item => item.visits || 0), 0);

    return (
        <div className="profile-views-chart">
            <h3>{getChartTitle()}</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'bar' ? (
                        <BarChart data={data} margin={20}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor={'end'}
                                height={80}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={[0, maxVisits * 1.1]} allowDecimals={false}/>
                            <Tooltip />
                            <Bar dataKey="visits" fill="#FF8559" />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={20}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor={'end'}
                                height={80}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={[0, maxVisits * 1.1]} allowDecimals={false}/>
                            <Tooltip />
                            <Line type="monotone" dataKey="visits" stroke="#FF8559" />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProfileViewsChart;