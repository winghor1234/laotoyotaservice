import { Outlet } from "react-router-dom";
import TransactionButton from "../../utils/TransactionButton";



const Transaction = () => {
    return (
        <div className=" bg-[#E2E8F0] p-2 sm:p-2 lg:p-4 ">
            <div className="ax-w-7xl mx-auto ">
                {/* Status Buttons */}
                <TransactionButton />
                <Outlet />
            </div>
        </div>
    );
};

export default Transaction;
