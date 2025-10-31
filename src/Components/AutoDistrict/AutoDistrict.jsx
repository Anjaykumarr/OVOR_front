import location from "../../assets/location.png";
import { useEffect, useState } from "react";
import { routes } from "../../services/routeServices/routeService";

function AutoDistrict() {
    const [error, setError] = useState("");
    const [district, setDistrict] = useState("Finding...");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        const updateDistrict = () => {
            const d = localStorage.getItem("district");
            const s = localStorage.getItem("stateName");
            if (d && s) setDistrict(`${d}, ${s}`);
        };

        updateDistrict();

        window.addEventListener("localStorageUpdate", updateDistrict);
        window.addEventListener("storage", updateDistrict);

        const isLandingPage = window.location.pathname === "/";
        const manualSelected = localStorage.getItem("manualSelected");

        if (isLandingPage || (!manualSelected && !localStorage.getItem("district"))) {
            runGPS();
        }

        async function runGPS() {
            if (!navigator.geolocation) {
                setError("Browser didn't provide geolocation");
                return;
            }

            navigator.geolocation.getCurrentPosition(success, failure);
        }

        async function success(position) {
            const { latitude, longitude } = position.coords;

            try {
                const data = await routes.getDistricts(latitude, longitude);

                    var districtData = data[0].district;
                    var stateData = data[0].state;

                if (isLandingPage || !manualSelected) {
                    localStorage.setItem("district", districtData);
                    localStorage.setItem("stateName", stateData);
                    window.dispatchEvent(new Event("localStorageUpdate"));
                    setDistrict(`${districtData}, ${stateData}`);
                }
            } catch {
                setError("District data not available for your location...");
            }
        }

        function failure() {
            setError("Permission denied or location unavailable");
        }

        return () => {
            window.removeEventListener("storage", updateDistrict);
            window.removeEventListener("localStorageUpdate", updateDistrict);
        };
    }, []);

    return (
        <div className="autodistrict">
            <img src={location} alt="location" />
            {error && <span className="error">{error}</span>}
            {warning && <span className="warning">{warning}</span>}
            {!error && !warning && <span>{district}</span>}
        </div>
    );
}

export default AutoDistrict;
