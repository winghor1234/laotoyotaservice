import { CalendarDays, Clock3, MapPinned } from 'lucide-react';
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useNavigate } from "react-router-dom";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

const PopupReject = ({ setRejectZone, bookingId, timeId, fetchBooking }) => {
  const { t } = useTranslation("booking"); // namespace booking
  const navigate = useNavigate();
  const [timeData, setTimeData] = useState([]);

  const handleChangeStatus = async () => {
    try {
      await axiosInstance.put(APIPath.UPDATE_BOOKING_STATUS(bookingId), { bookingStatus: "cancel" });
      await axiosInstance.put(APIPath.UPDATE_TIME_STATUS(timeId), { timeStatus: "true" });

      navigate("/user/booking");
      SuccessAlert(t("reject_alert"));
      fetchBooking();
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchTime = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ONE_TIME(timeId));
      setTimeData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchTime();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("reject_booking_title")}</h2>

        <div className="space-y-4 sm:space-y-5">
          <div className="w-full py-3 sm:py-4 border border-gray-300 rounded-lg text-lg sm:text-xl shadow-sm flex justify-between items-center px-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className='flex flex-col items-center gap-1'>
              <CalendarDays className='text-lg text-gray-600' />
              <p className="font-medium text-gray-600 text-xs lg:text-sm">{t("date_label")}:</p>
              <p className="text-gray-900 text-md lg:text-xl">{timeData?.date}</p>
            </div>
            <div className='flex flex-col items-center gap-1'>
              <Clock3 className='text-lg text-gray-600' />
              <p className="font-medium text-gray-600 text-xs lg:text-sm">{t("time_label")}:</p>
              <p className="text-gray-900 text-md lg:text-xl">{timeData?.time}</p>
            </div>
            <div className='flex flex-col items-center gap-1'>
              <MapPinned className='text-lg text-gray-600' />
              <p className="font-medium text-gray-600 text-xs lg:text-sm">{t("zone_label")}:</p>
              <p className="text-gray-900 text-md lg:text-xl">{timeData?.branch?.branch_name}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4">
          <button
            onClick={() => setRejectZone(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
          >
            {t("cancel_button")}
          </button>
          <button
            onClick={handleChangeStatus}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
          >
            {t("reject_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupReject;
