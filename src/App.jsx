import { Routes, Route } from "react-router-dom";
import Header from "./Components/Headers/Header";
import LandingPage from "./Pages/LandingPage";
import Home from "./Pages/Home";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
