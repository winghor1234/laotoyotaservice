import { Outlet } from "react-router-dom"
import Time_ZoneStatusButton from "../../utils/Time_ZoneStatusButton"


const Time_Zone = () => {
    return (
        <div className=" bg-[#E2E8F0]  min-h-screen p-2 sm:p-2 lg:p-4">
            <div className="ax-w-7xl mx-auto ">
                {/* Status button  */}
                <Time_ZoneStatusButton/>
                <Outlet/>

            </div>
        </div>
    )
}

export default Time_Zone
