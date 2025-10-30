import "../../Styles/ComponentStyle/header.css"
import logo from "../../assets/logo_nrega.jpg"
import AutoDistrict from "../AutoDistrict/AutoDistrict";


function Header() {

    return (
        <>
            <div className="header">
                
                <img src={ logo } alt="Loading..." />
                
                <h1>Our Voice, Our Rights</h1>

                <AutoDistrict />
                
            </div>
        </>
    )
}

export default Header;