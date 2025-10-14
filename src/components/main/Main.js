import { useState } from "react";
import Profile from "../profile/Profile";
import Navbar from "../navbar/Navbar";

const Main = () => {
    const [page, setPage] = useState(1)

    return(
        <div>
            {page === 1 && <Profile setPage={setPage}/>}
            <Navbar />
        </div>
    )

}

export default Main;