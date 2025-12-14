import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScanTypeChart = ({ data, chartType }) => {
    // Updated color palette
    const COLORS = ['#6366f1', '#818cf8'];
    const maxValue = Math.max(...data.map(item => item.value || 0), 0);

    return (
        <div className="scan-type-chart">
            <h3>Visit Types</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'pie' ? (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12 }} />
                            <YAxis domain={[0, maxValue * 1.1]} allowDecimals={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScanTypeChart;
