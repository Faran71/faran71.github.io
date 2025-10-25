import { useState } from "react";
import Profile from "../../components/profile/Profile";
import Navbar from "../../components/navbar/Navbar";
import CustomBackground from "../../components/customBackground/CustomBackground";

const Main = () => {
    const [page, setPage] = useState(1)

    return(
        <div>
            <CustomBackground />
            {page === 1 && <Profile setPage={setPage}/>}
            <Navbar />
        </div>
    )

}

export default Main;