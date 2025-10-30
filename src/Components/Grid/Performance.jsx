import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./gridstyles/performance.css";
import { routes } from "../../services/routeServices/routeService";

function Performance() {
    const [years, setYears] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMetric, setSelectedMetric] = useState("");
    const [chartData, setChartData] = useState([]);
    const [district, setDistrict] = useState(localStorage.getItem("district") || "");

    useEffect(() => {
        async function fetchDropdownData() {
            try {
                const [yearRes, metricRes] = await Promise.all([
                    routes.GetYear(),
                    routes.GetMetric(),
                ]);

                setYears(yearRes || []);
                setMetrics(metricRes || []);

                if (yearRes && yearRes.length > 0) {
                    setSelectedYear(yearRes[0].fin_year);
                }
                if (metricRes && metricRes.length > 0) {
                    setSelectedMetric(metricRes[0].metric_Name);
                }
            } catch (error) {
                console.error("Error loading dropdown data:", error);
            }
        }

        fetchDropdownData();
    }, []);

    useEffect(() => {
        const updateDistrict = () => {
            const newDistrict = localStorage.getItem("district");
            if (newDistrict && newDistrict !== district) {
                setDistrict(newDistrict);
            }
        };

        window.addEventListener("localStorageUpdate", updateDistrict);
        window.addEventListener("storage", updateDistrict);

        return () => {
            window.removeEventListener("localStorageUpdate", updateDistrict);
            window.removeEventListener("storage", updateDistrict);
        };
    }, [district]);

    useEffect(() => {
        if (!selectedMetric || !selectedYear || !district) return;

        async function fetchPerformanceData() {
            setChartData([]);
            try {
                const response = await routes.GetChartData(district, selectedMetric, selectedYear);
                console.log("Raw API response:", response);

                const formattedData = (response || []).map((item) => ({
                    month: item.month,
                    value: parseFloat(item.metric_value),
                }));

                const monthOrder = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December",
                ];
                formattedData.sort(
                    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
                );

                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching performance data:", error);
                setChartData([]);
            }
        }

        fetchPerformanceData();
    }, [selectedYear, selectedMetric, district]);

    return (
        <div className="chart-wrapper">
            <h2 className="chart-title">📊 {district ? `${district} District` : "District"} Performance by Month</h2>
            {/*<h2> {`${district}`}</h2>*/}

            <div className="filter-container">
                <select
                    className="filter-dropdown"
                    value={selectedMetric}
                    onChange={(e) => {
                        setSelectedMetric(e.target.value);
                        setChartData([]);
                    }}
                >
                    <option value="">Select Metric</option>
                    {metrics.map((metric, i) => (
                        <option key={i} value={metric.metric_Name || ""}>
                            {metric.metric_Name || "Unnamed Metric"}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-dropdown"
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setChartData([]);
                    }}
                >
                    <option value="">Select Year</option>
                    {years.map((year, i) => (
                        <option key={i} value={year.fin_year || year}>
                            {year.fin_year || year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            angle={-30}
                            textAnchor="end"
                            interval={0}
                            height={60}
                        />
                        <YAxis
                            label={{
                                value: selectedMetric || "Value",
                                angle: -90,
                                position: "insideLeft",
                                style: { textAnchor: "middle" },
                            }}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#1e90ff"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Performance;
