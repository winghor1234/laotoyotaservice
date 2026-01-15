import { Outlet } from "react-router-dom"
import RewardStatusButton from "../../utils/GiftStatusButton"


const Reward = () => {
    return (
        <div className="bg-[#E2E8F0]  min-h-screen p-2 sm:p-2 lg:p-4">
            <div className="ax-w-7xl mx-auto ">
                {/* Status button  */}
                <RewardStatusButton/>
                <Outlet/>

            </div>
        </div>
    )
}

export default Reward
