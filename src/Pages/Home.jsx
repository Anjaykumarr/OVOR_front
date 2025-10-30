import "../Styles/PageStyles/home.css"
import DistrictGrid from "../Components/Grid/DistrictGrid";
import Performance from "../Components/Grid/Performance"
import Trend from "../Components/Grid/Trend";
import Compare from "../Components/Grid/Compare";


function Home() {
    return (
        <>
            <div className='home'>
                <div className="space"></div>
                <div className="districtgrid">
                    <DistrictGrid />
                </div>
                <div className="performance">
                    <Performance />
                </div>
                <div className="trend">
                    <Trend />
                </div>
                <div className="compare">
                    <Compare />
                </div>
            </div>
        </>
    );
}

export default Home;