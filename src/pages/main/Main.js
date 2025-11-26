import { useState } from "react";
import Profile from "../../components/profile/Profile";
import CustomBackground from "../../components/customBackground/CustomBackground";

const Main = () => {
    const [neonColor, setNeonColor] = useState("#00ff88");

    return(
        <div>
            <CustomBackground neonColor={neonColor} setNeonColor={setNeonColor}/>
            <Profile/>
        </div>
    )

}

export default Main;