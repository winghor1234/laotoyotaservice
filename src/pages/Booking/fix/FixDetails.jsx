import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { BackButton } from "../../../utils/BackButton";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import PopupFix from "./PopupFix";
import { useTranslation } from "react-i18next";

const FixDetails = () => {
  const { t } = useTranslation("booking"); 
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [fixData, setFixData] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [timeId, setTimeId] = useState("");

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
      setFixData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (bookingId, timeId) => {
    setShowPopup(true);
    setBookingId(bookingId);
    setTimeId(timeId);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative overflow-y-auto bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <BackButton />
          <hr className="border-gray-300 w-full mb-4 sm:mb-6" />

          <h2 className="text-center text-lg sm:text-xl lg:text-2xl font-medium mb-6 sm:mb-8">
            {t("fix_details")}
          </h2>

          {/* Desktop/Tablet */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-6 text-sm lg:text-base font-medium text-gray-700">
              <div className="flex flex-col items-center py-4 col-span-2 lg:col-span-1 gap-2">
                <span className="text-base lg:text-lg text-gray-500 text-center">
                  {t("customer_info")}
                </span>
                <div className="bg-gray-100 w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full">
                  <FaCar className="text-2xl lg:text-4xl text-gray-700" />
                </div>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("customer_name")}</p>
                <p className="text-gray-900">{fixData?.user?.username}</p>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("customer_phone")}</p>
                <p className="text-gray-900">{fixData?.user?.phoneNumber}</p>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("plate_number")}</p>
                <p className="text-gray-900">{fixData?.car?.plateNumber}</p>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("engine_number")}</p>
                <p className="text-gray-900">{fixData?.car?.engineNumber}</p>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("frame_number")}</p>
                <p className="text-gray-900">{fixData?.car?.frameNumber}</p>
              </div>
              <div className="space-y-3 py-4 flex flex-col items-center">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("car_model")}</p>
                <p className="text-gray-900">{fixData?.car?.model}</p>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("date_label")}</p>
                <p className="text-gray-900">{fixData?.time?.date}</p>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-gray-500 text-sm lg:text-lg">{t("time_label")}</p>
                <p className="text-gray-900">{fixData?.time?.time}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center lg:justify-end mt-6">
            <button
              onClick={() => handleSubmit(fixData?.booking_id, fixData?.timeId)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full transition-colors font-medium text-sm lg:text-base w-full sm:w-auto"
            >
              {t("complete_fix")}
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-6 mt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 w-20 h-20 flex items-center justify-center rounded-full">
                <FaCar className="text-3xl text-gray-700" />
              </div>
              <span className="text-lg text-gray-500">{t("customer_info")}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">{t("customer_info")}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("customer_name")}:</span>
                    <span className="font-medium">{fixData?.user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("customer_phone")}:</span>
                    <span className="font-medium">{fixData?.user?.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">{t("car_info")}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("plate_number")}:</span>
                    <span className="font-medium">{fixData?.car?.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("engine_number")}:</span>
                    <span className="font-medium">{fixData?.car?.engineNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("frame_number")}:</span>
                    <span className="font-medium">{fixData?.car?.frameNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("car_model")}:</span>
                    <span className="font-medium">{fixData?.car?.model}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">{t("appointment_time")}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("date_label")}:</span>
                    <span className="font-medium">{fixData?.time?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("time_label")}:</span>
                    <span className="font-medium">{fixData?.time?.time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-full transition-colors font-medium w-full"
                >
                  {t("complete_fix")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && <PopupFix setShowPopup={setShowPopup} bookingId={bookingId} timeId={timeId} />}
    </div>
  );
};

export default FixDetails;
