import { Outlet } from "react-router-dom";
import BookingStatusButton from "../../utils/BookingStatusButton";



const Booking = () => {
  return (
    <div className=" bg-[#E2E8F0]  min-h-screen p-2 sm:p-2 lg:p-4">
      <div className="ax-w-7xl mx-auto ">
        {/* Status Buttons */}
        <BookingStatusButton/>
        <Outlet />
      </div>
    </div>
  );
};

export default Booking;
