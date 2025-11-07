import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScanTypeChart = ({ data, chartType }) => {
    const COLORS = ['#FF8559', '#82C294'];
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, maxValue * 1.1]} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScanTypeChart;