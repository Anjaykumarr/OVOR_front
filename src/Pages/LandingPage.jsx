import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../Styles/PageStyles/landingpage.css";
import { routes } from "../services/routeServices/routeService";

function LandingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedState, setSelectedState] = useState(localStorage.getItem("stateName") || "");
    const [selectedDistrict, setSelectedDistrict] = useState(localStorage.getItem("district") || "");
    const [stateList, setStateList] = useState([]);
    const [district, setDistrict] = useState([]);

    useEffect(() => {
        async function getStateData() {
            const data = await routes.getStateList();
            setStateList(data);
        }
        getStateData();
    }, []);

    useEffect(() => {
        async function getDistrictData() {
            if (selectedState) {
                const data = await routes.getDistrictList(selectedState);
                setDistrict(data);
            } else {
                setDistrict([]);
            }
        }
        getDistrictData();
    }, [selectedState]);

    const triggerUpdate = () => {
        window.dispatchEvent(new Event("localStorageUpdate"));
    };

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedDistrict("");
        localStorage.setItem("stateName", newState);
        localStorage.setItem("manualSelected", "true");
        localStorage.removeItem("district");
        triggerUpdate();
    };

    const handleDistrictChange = (e) => {
        const newDistrict = e.target.value;
        setSelectedDistrict(newDistrict);
        localStorage.setItem("district", newDistrict);
        localStorage.setItem("manualSelected", "true");
        triggerUpdate();
    };

    const handleGo = () => {
        if (selectedState && selectedDistrict) {
            navigate("/home");
        } else {
            alert("Please select both State and District before continuing.");
        }
    };

    // Automatically reload GPS data if landing page refreshes
    useEffect(() => {
        const isLandingPage = location.pathname === "/";
        if (!isLandingPage) return;

        const updateFromStorage = () => {
            const autoState = localStorage.getItem("stateName");
            const autoDistrict = localStorage.getItem("district");

            if (autoState && autoDistrict) {
                setSelectedState(autoState);
                routes.getDistrictList(autoState).then((data) => {
                    setDistrict(data);
                    setSelectedDistrict(autoDistrict);
                });
            }
        };

        // Load once immediately
        updateFromStorage();

        // Listen for GPS/AutoDistrict updates
        window.addEventListener("localStorageUpdate", updateFromStorage);
        window.addEventListener("storage", updateFromStorage);

        return () => {
            window.removeEventListener("localStorageUpdate", updateFromStorage);
            window.removeEventListener("storage", updateFromStorage);
        };
    }, [location.pathname]);

    return (
        <div className="landing-container">
            <h1 className="title">🌍 Select Your Region</h1>

            <select
                value={selectedState}
                onChange={handleStateChange}
                className="dropdown"
            >
                <option value="">Select State</option>
                {stateList.map((item, index) => (
                    <option key={index} value={item.state_name}>
                        {item.state_name}
                    </option>
                ))}
            </select>

            {selectedState && (
                <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="dropdown"
                >
                    <option value="">Select District</option>
                    {district.map((item, index) => (
                        <option key={index} value={item.district_name}>
                            {item.district_name}
                        </option>
                    ))}
                </select>
            )}

            {selectedState && selectedDistrict && (
                <button className="go-button" onClick={handleGo}>
                    Go
                </button>
            )}

            {selectedDistrict && (
                <p className="result">
                    You selected <strong>{selectedDistrict}</strong> district in{" "}
                    <strong>{selectedState}</strong>.
                </p>
            )}
        </div>
    );
}

export default LandingPage;
