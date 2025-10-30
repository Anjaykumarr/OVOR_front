import React, { useState, useEffect } from "react";
import "../Grid/gridstyles/compare.css";
import { routes } from "../../services/routeServices/routeService";

function Compare() {
    const [districtDrop, setDistrictDrop] = useState([]);
    const [district1, setDistrict1] = useState(localStorage.getItem("district") || "");
    const [district2, setDistrict2] = useState("");
    const [districtData, setDistrictData] = useState({});

    // Fetch district list for the current state
    useEffect(() => {
        const state = localStorage.getItem("stateName");

        if (!state) return;

        async function getDistrictList() {
            try {
                const response = await routes.getDistrictList(state);
                if (response && response.length > 0) {
                    setDistrictDrop(response);

                    // Auto-set second district if not set yet
                    if (!district2 && response.length > 1) {
                        const first = localStorage.getItem("district");
                        const second = response.find(
                            (d) => d.district_name !== first
                        );
                        if (second) setDistrict2(second.district_name);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch district list:", error);
            }
        }

        getDistrictList();
    }, [district1]);

    // Listen for live updates (GPS or manual change)
    useEffect(() => {
        const updateDistrict = () => {
            const newDistrict = localStorage.getItem("district");
            if (newDistrict && newDistrict !== district1) {
                setDistrict1(newDistrict);
            }
        };

        window.addEventListener("localStorageUpdate", updateDistrict);
        window.addEventListener("storage", updateDistrict);

        return () => {
            window.removeEventListener("localStorageUpdate", updateDistrict);
            window.removeEventListener("storage", updateDistrict);
        };
    }, [district1]);

    // Fetch comparison data for both districts
    useEffect(() => {
        async function getComparisonData() {
            if (!district1 || !district2) return;

            try {
                const [data1, data2] = await Promise.all([
                    routes.getDistrictDashboardData(district1),
                    routes.getDistrictDashboardData(district2),
                ]);

                const mappedData1 = {
                    workers: data1[0].total_No_of_Workers,
                    wage: data1[0].average_Wage_rate_per_day_per_person,
                    days: data1[0].average_days_of_employment_provided_per_Household,
                    works: data1[0].number_of_Completed_Works,
                };

                const mappedData2 = {
                    workers: data2[0].total_No_of_Workers,
                    wage: data2[0].average_Wage_rate_per_day_per_person,
                    days: data2[0].average_days_of_employment_provided_per_Household,
                    works: data2[0].number_of_Completed_Works,
                };

                setDistrictData({
                    [district1]: mappedData1,
                    [district2]: mappedData2,
                });
            } catch (error) {
                console.error("Error fetching comparison data:", error);
            }
        }

        getComparisonData();
    }, [district1, district2]);

    const metrics = [
        { key: "workers", label: "👷 Workers" },
        { key: "wage", label: "💰 Avg Wage" },
        { key: "days", label: "⏰ Avg Days" },
        { key: "works", label: "🏗️ Works Done" },
    ];

    const d1 = districtData[district1] || {};
    const d2 = districtData[district2] || {};

    const compare = (a, b) => {
        if (a > b) return "higher";
        if (a < b) return "lower";
        return "equal";
    };

    return (
        <div className="compare-section">
            <h2 className="compare-title">⚖️ Compare Districts</h2>
            {/*{district1 && <h3 className="compare-subtitle">📍 {district1}</h3>}*/}

            <div className="dropdown-row">
                <select
                    value={district1}
                    onChange={(e) => setDistrict1(e.target.value)}
                    className="district-select"
                >
                    <option value="">Select District 1</option>
                    {districtDrop.map((item, index) => (
                        <option key={index} value={item.district_name}>
                            {item.district_name}
                        </option>
                    ))}
                </select>

                <span className="vs-text">vs</span>

                <select
                    value={district2}
                    onChange={(e) => setDistrict2(e.target.value)}
                    className="district-select"
                >
                    <option value="">Select District 2</option>
                    {districtDrop.map((item, index) => (
                        <option key={index} value={item.district_name}>
                            {item.district_name}
                        </option>
                    ))}
                </select>
            </div>

            {district1 && district2 && d1 && d2 &&
                Object.keys(d1).length > 0 &&
                Object.keys(d2).length > 0 && (
                    <>
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>{district1}</th>
                                    <th>{district2}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.map((m) => {
                                    const val1 = d1[m.key];
                                    const val2 = d2[m.key];
                                    const result = compare(val1, val2);
                                    return (
                                        <tr key={m.key}>
                                            <td>{m.label}</td>
                                            <td
                                                className={
                                                    result === "higher"
                                                        ? "highlight-green"
                                                        : result === "lower"
                                                            ? "highlight-red"
                                                            : ""
                                                }
                                            >
                                                {m.key === "wage" ? `₹${val1}` : val1}
                                            </td>
                                            <td
                                                className={
                                                    result === "lower"
                                                        ? "highlight-green"
                                                        : result === "higher"
                                                            ? "highlight-red"
                                                            : ""
                                                }
                                            >
                                                {m.key === "wage" ? `₹${val2}` : val2}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <p className="legend">🟢 Higher performance 🔴 Lower performance</p>
                    </>
                )}
        </div>
    );
}

export default Compare;
