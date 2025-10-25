import { GiBowlSpiral } from "react-icons/gi";

import "./Navbar.css"
const Navbar = () => {
    return (
        <div className="navbar-main">
            <button className="home-btn dock"><GiBowlSpiral className="spiral-icon" /></button>
            <div>
                <button className="dock">a</button>
                <button className="dock">a</button>
                <button className="dock">a</button>
                <button className="dock">a</button>
            </div>
        </div>
    )
}

export default Navbar;