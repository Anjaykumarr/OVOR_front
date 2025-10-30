import React, { useEffect, useState } from "react";
import "./gridstyles/districtgrid.css";
import { routes } from "../../services/routeServices/routeService";

function DistrictGrid() {
    const [metrics, setMetrics] = useState([]);
    const [districtName, setDistrictName] = useState(localStorage.getItem("district") || "");

    useEffect(() => {
        async function fetchDashboard(district) {
            if (!district) return;
            try {
                const apidata = await routes.getDistrictDashboardData(district);
                const data = apidata[0];

                setMetrics([
                    {
                        title: "Total Workers",
                        icon: "👷‍♂️",
                        value: data.total_No_of_Workers,
                        color: "#2ecc71"
                    },
                    {
                        title: "Average Wage / Day",
                        icon: "💰",
                        value: data.average_Wage_rate_per_day_per_person,
                        color: "#f1c40f"
                    },
                    {
                        title: "Ongoing Works",
                        icon: "🏗️",
                        value: data.number_of_Ongoing_Works,
                        color: "#3498db"
                    },
                    {
                        title: "Average Days Worked / Household",
                        icon: "⏰",
                        value: data.average_days_of_employment_provided_per_Household,
                        color: "#9b59b6"
                    },
                    {
                        title: "Women Participation",
                        icon: "👩‍🌾",
                        value: data.women_Persondays,
                        color: "#e67e22"
                    },
                    {
                        title: "Differently Abled Workers",
                        icon: "♿",
                        value: data.differently_abled_persons_worked,
                        color: "#95a5a6"
                    },
                    {
                        title: "Work Completed",
                        icon: "✅",
                        value: data.number_of_Completed_Works,
                        color: "#16a085"
                    },
                    {
                        title: "Approved Budget",
                        icon: "₹",
                        value: data.approved_Labour_Budget,
                        color: "#2980b9"
                    }
                ]);
            } catch (e) {
                console.error("Error fetching dashboard:", e);
            }
        }

        // initial load
        fetchDashboard(districtName);

        // listen for changes from LandingPage or GPS updates
        const handleStorageUpdate = () => {
            const newDistrict = localStorage.getItem("district");
            if (newDistrict && newDistrict !== districtName) {
                setDistrictName(newDistrict);
                fetchDashboard(newDistrict);
            }
        };

        window.addEventListener("localStorageUpdate", handleStorageUpdate);
        window.addEventListener("storage", handleStorageUpdate);

        return () => {
            window.removeEventListener("localStorageUpdate", handleStorageUpdate);
            window.removeEventListener("storage", handleStorageUpdate);
        };
    }, [districtName]);

    return (
        <div className="district">
            <h1>District Dashboard</h1>
            {/*{districtName && <h2 className="sub-heading">📍 {districtName}</h2>}*/}

            <div className="performance-grid">
                {metrics.length === 0 ? (
                    <p>Loading district data...</p>
                ) : (
                    metrics.map((item, i) => (
                        <div key={i} className="card">
                            <div className="card-icon">{item.icon}</div>
                            <div className="card-content">
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-value" style={{ color: item.color }}>
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DistrictGrid;
