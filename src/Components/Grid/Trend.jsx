import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import "./gridstyles/trend.css";
import { routes } from "../../services/routeServices/routeService";

function Trend() {
    const [workersData, setWorkersData] = useState([]);
    const [wageData, setWageData] = useState([]);
    const [district, setDistrict] = useState(localStorage.getItem("district") || "");
    const [workersTrend, setWorkersTrend] = useState("→ Steady");
    const [wageTrend, setWageTrend] = useState("→ Steady");

    // Detect trend direction
    const detectTrend = (data) => {
        if (!data || data.length < 2) return "→ Steady";
        const first = data[0].value;
        const last = data[data.length - 1].value;
        const change = ((last - first) / first) * 100;

        if (change > 2) return "↑ Increasing";
        if (change < -2) return "↓ Decreasing";
        return "→ Steady";
    };

    // Fetch trend data for selected district
    async function getTrendData(districtName) {
        if (!districtName) return;

        try {
            const data = await routes.WageOverTime(districtName);

            if (Array.isArray(data) && data.length > 0) {
                const workers = data.map((item) => ({
                    year: item.year,
                    value: item.avg_workers,
                }));

                const wages = data.map((item) => ({
                    year: item.year,
                    value: item.avg_wages,
                }));

                setWorkersData(workers);
                setWageData(wages);

                // Auto-detect trend direction
                setWorkersTrend(detectTrend(workers));
                setWageTrend(detectTrend(wages));
            } else {
                console.warn("No trend data found for:", districtName);
                setWorkersData([]);
                setWageData([]);
                setWorkersTrend("→ Steady");
                setWageTrend("→ Steady");
            }
        } catch (error) {
            console.error("Error fetching trend data:", error);
            setWorkersData([]);
            setWageData([]);
        }
    }

    // Load data initially and when district changes
    useEffect(() => {
        if (district) getTrendData(district);
    }, [district]);

    // Listen for district updates (manual or GPS)
    useEffect(() => {
        const updateDistrict = () => {
            const d = localStorage.getItem("district");
            if (d && d !== district) {
                setDistrict(d);
            }
        };

        updateDistrict();
        window.addEventListener("localStorageUpdate", updateDistrict);
        window.addEventListener("storage", updateDistrict);

        return () => {
            window.removeEventListener("localStorageUpdate", updateDistrict);
            window.removeEventListener("storage", updateDistrict);
        };
    }, [district]);

    return (
        <div className="trend-section">
            <h2>💰 Wage & Workers Trend</h2>
            {/*{district && <h3 className="trend-subtitle">📍 {district}</h3>}*/}

            <div className="trend-grid">
                <div className="trend-card">
                    <div className="trend-header">
                        👷‍♂️ <span>Workers Over Time</span>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                        <LineChart data={workersData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2ecc71"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                    <p
                        className={`trend-label ${workersTrend.includes("Increasing")
                            ? "increasing"
                            : workersTrend.includes("Decreasing")
                                ? "decreasing"
                                : "steady"
                            }`}
                    >
                        {workersTrend}
                    </p>
                </div>

                <div className="trend-card">
                    <div className="trend-header">
                        💰 <span>Average Wage Rate</span>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                        <LineChart data={wageData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#f1c40f"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                    <p
                        className={`trend-label ${wageTrend.includes("Increasing")
                            ? "increasing"
                            : wageTrend.includes("Decreasing")
                                ? "decreasing"
                                : "steady"
                            }`}
                    >
                        {wageTrend}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Trend;