import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import PopupApprove from "./PopupApprove";
import PopupReject from "./PopupReject";
import { BackButton } from "../../../utils/BackButton";
import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const ReceiverCarDetail = () => {
  const { t } = useTranslation("booking"); // namespace
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const timeId = searchParams.get("time");
  const bookingId = id;

  const [data, setData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [bookingDetail, setBookingDetail] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectZone, setRejectZone] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId));
      setData(res?.data?.data);
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
  const handleFetchBookingDetail = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(bookingId));
      setBookingDetail(res?.data?.data);
      console.log("Booking Detail:", res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }



  const userId = data?.userId;

  useEffect(() => {
    fetchBooking();
    handleFetchTime();
    handleFetchBookingDetail();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-2 sm:p-3 lg:p-4">
          <BackButton />
          <hr className="border-gray-300 w-full mb-2 sm:mb-3" />
          <h2 className="text-center text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-5">
            {t("receiver_car_detail")}
          </h2>

          {/* Desktop/Tablet View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-2 lg:gap-4 text-xs lg:text-sm font-medium text-gray-700 mb-4">
              <div className="flex flex-col items-center py-2 col-span-2 lg:col-span-1 gap-1">
                <span className="text-sm lg:text-base text-gray-500 text-center">{t("customer_info")}</span>
                <div className="bg-gray-100 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full">
                  <FaCar className="text-xl lg:text-2xl text-gray-700" />
                </div>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("customer_name")}</p>
                <p className="text-gray-900">{data?.user?.username}</p>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("customer_phone")}</p>
                <p className="text-gray-900">{data?.user?.phoneNumber}</p>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("plate_number")}</p>
                <p className="text-gray-900">{data?.car?.plateNumber}</p>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("engine_number")}</p>
                <p className="text-gray-900">{data?.car?.engineNumber}</p>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("frame_number")}</p>
                <p className="text-gray-900">{data?.car?.frameNumber}</p>
              </div>

              <div className="space-y-1 py-2">
                <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("car_model")}</p>
                <p className="text-gray-900">{data?.car?.model}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-6 py-2 text-center font-medium text-gray-700 mb-4 lg:mb-0">
                <div className="space-y-1">
                  <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("date_label")}</p>
                  <p className="text-gray-900">{data?.time?.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("time_label")}</p>
                  <p className="text-gray-900">{data?.time?.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("zone_label")}</p>
                  <p className="text-gray-900">{timeData?.zone?.zoneName}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("branch_name")}</p>
                  <p className="text-gray-900">{data?.branch?.branch_name}</p>
                </div>
                <div className="space-y-1">

                  {
                    bookingDetail?.map((item, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-500 text-xs lg:text-sm">{t("service_name")}</p>
                        <p className="text-gray-900">{item?.service?.serviceName}</p>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors font-medium text-xs lg:text-sm"
                >
                  {t("approve")}
                </button>
                <button
                  onClick={() => setRejectZone(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors font-medium text-xs lg:text-sm"
                >
                  {t("reject")}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full">
                <FaCar className="text-2xl text-gray-700" />
              </div>
              <span className="text-base text-gray-500">{t("customer_info")}</span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setShowPopup(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full transition-colors font-medium text-sm"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => setRejectZone(true)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition-colors font-medium text-sm"
              >
                {t("reject")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showPopup && (
        <PopupApprove
          setShowPopup={setShowPopup}
          bookingId={bookingId}
          timeId={timeId}
          userId={userId}
          fetchBooking={fetchBooking}
        />
      )}
      {rejectZone && (
        <PopupReject
          setRejectZone={setRejectZone}
          bookingId={bookingId}
          timeId={timeId}
          fetchBooking={fetchBooking}
        />
      )}
    </div>
  );
};

export default ReceiverCarDetail;
