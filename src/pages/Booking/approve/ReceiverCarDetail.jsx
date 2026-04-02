
import { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaCar } from "react-icons/fa";
import PopupApprove from "./PopupApprove";
import PopupReject from "./PopupReject";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import EditForm from "./editForm";
import { useNavigate } from "react-router-dom";
import { formatDates } from "../../../utils/FormatDate";

const ReceiverCarDetail = () => {
  const { t } = useTranslation("booking");
  const { id: bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [bookingDetail, setBookingDetail] = useState([]);
  const [timeFixData, setTimeFixData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectZone, setRejectZone] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedTimeId, setSelectedTimeId] = useState(null);
  const navigate = useNavigate();




  const loadAllData = useCallback(async () => {
    try {
      // 1️⃣ fetch booking
      const bookingRes = await axiosInstance.get(
        APIPath.SELECT_ONE_BOOKING(bookingId)
      );
      const bookingData = bookingRes?.data?.data;
      // console.log("booking data:", bookingData);
      setBooking(bookingData);
      setSelectedTimeId(bookingData.timeId);
      // console.log("booking data time id :", bookingData?.timeId);


      // 3️⃣ fetch booking detail
      const detailRes = await axiosInstance.get(
        APIPath.SELECT_BOOKING_DETAIL_BY(bookingId)
      );
      setBookingDetail(detailRes?.data?.data);

      // fetch timeFix
      const timeFixRes = await axiosInstance.get(APIPath.SELECT_ALL_TIME_FIX);
      setTimeFixData(timeFixRes?.data?.data);
      // console.log("time fix data:", timeFixRes?.data?.data);

    } catch (error) {
      console.log(error);
    }
  }, [bookingId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const userId = booking?.userId;
  const selectedTimeFix = timeFixData.find((item) => item?.timeId === selectedTimeId);
  const zoneName = selectedTimeFix?.zone?.zoneName;
  const zoneId = selectedTimeFix?.zoneId;

  return (
    <div className="relative min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4">

        <div
          onClick={() => navigate("/user/booking")}
          className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4">
          <button className="flex items-center gap-2 text-gray-700 hover:text-black">
            <FaArrowLeft className="text-sm sm:text-base cursor-pointer" />
            <span className="font-medium text-sm sm:text-lg lg:text-xl cursor-pointer">{t("back")}</span>
          </button>
        </div>
        <hr className="border-gray-300 w-full mb-3" />
        <h2 className="text-center text-lg font-medium mb-5">
          {t("receiver_car_detail")}
        </h2>

        {/* ================= MOBILE ================= */}
        <div className="block md:hidden px-4 py-6 space-y-6">

          {/* Customer Card */}
          <div className="bg-white shadow rounded-xl p-4 space-y-3">

            <div className="flex items-center gap-4">
              <div className="bg-gray-100 w-14 h-14 flex items-center justify-center rounded-full">
                <FaCar className="text-xl text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t("customer_name")}</p>
                <p className="font-medium">{booking?.user?.username}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("customer_phone")}</p>
              <p>{booking?.user?.phoneNumber}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("plate_number")}</p>
              <p>{booking?.car?.plateNumber}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("car_model")}</p>
              <p>{booking?.car?.model}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("car_color")}</p>
              <p>{booking?.car?.color}</p>
            </div>

          </div>


          {/* Booking Info Card */}
          <div className="bg-white shadow rounded-xl p-4 space-y-3">

            <div>
              <p className="text-gray-500 text-sm">{t("date_label")}</p>
              <p>{formatDates(booking?.day)}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("time_label")}</p>
              <p>{booking?.time?.time}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("zone_label")}</p>
              <p>{zoneName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("branch_name")}</p>
              <p>{booking?.branch?.branch_name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">{t("service_name")}</p>
              <div className="space-y-1">
                {bookingDetail?.map((item, index) => (
                  <p key={index}>{item?.service?.serviceName}</p>
                ))}
              </div>
            </div>

          </div>


          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3">

            <button
              onClick={() => setEdit(true)}
              className="bg-yellow-500 hover:bg-yellow-600 transition text-white py-2 rounded-lg"
            >
              {t("edit")}
            </button>

            <button
              onClick={() => setShowPopup(true)}
              className="bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-lg"
            >
              {t("approve")}
            </button>

            <button
              onClick={() => setRejectZone(true)}
              className="bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg"
            >
              {t("reject")}
            </button>

          </div>

        </div>



        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block px-6 py-8">

          {/* Customer + Car Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 text-center font-medium text-gray-700 mb-10">

            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-500">{t("customer_info")}</span>
              <div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full">
                <FaCar className="text-2xl text-gray-700" />
              </div>
            </div>

            <div>
              <p className="text-gray-500">{t("customer_name")}</p>
              <p>{booking?.user?.username}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("customer_phone")}</p>
              <p>{booking?.user?.phoneNumber}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("plate_number")}</p>
              <p>{booking?.car?.plateNumber}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("engine_number")}</p>
              <p className="break-words">{booking?.car?.engineNumber}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("frame_number")}</p>
              <p className="break-words">{booking?.car?.frameNumber}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("car_model")}</p>
              <p>{booking?.car?.model}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("car_color")}</p>
              <p>{booking?.car?.color}</p>
            </div>

          </div>


          {/* Booking Info Section */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-center mb-10">

            <div>
              <p className="text-gray-500">{t("date_label")}</p>
              <p>{formatDates(booking?.day)}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("time_label")}</p>
              <p>{booking?.time?.time}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("zone_label")}</p>
              <p>{zoneName}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("branch_name")}</p>
              <p>{booking?.branch?.branch_name}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("service_name")}</p>
              <div className="space-y-1">
                {bookingDetail?.map((item, index) => (
                  <p key={index}>{item?.service?.serviceName}</p>
                ))}
              </div>
            </div>

          </div>


          {/* Desktop Buttons */}
          <div className="flex justify-center gap-6">

            <button
              onClick={() => setEdit(true)}
              className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-8 py-2 rounded-full"
            >
              {t("edit")}
            </button>

            <button
              onClick={() => setShowPopup(true)}
              className="bg-green-500 hover:bg-green-600 transition text-white px-8 py-2 rounded-full"
            >
              {t("approve")}
            </button>

            <button
              onClick={() => setRejectZone(true)}
              className="bg-red-500 hover:bg-red-600 transition text-white px-8 py-2 rounded-full"
            >
              {t("reject")}
            </button>

          </div>

        </div>


      </div>

      {/* Popups */}
      {showPopup && (
        <PopupApprove
          setShowPopup={setShowPopup}
          bookingId={bookingId}
          userId={userId}
          // timeId={selectedTimeId}
          fetchBooking={loadAllData}
          zoneName={zoneName}
          zoneId={zoneId}
        />
      )}

      {rejectZone && (
        <PopupReject
          setRejectZone={setRejectZone}
          bookingId={bookingId}
          timeId={selectedTimeId}
          fetchBooking={loadAllData}
          zoneName={zoneName}
        />
      )}

      {edit && (
        <EditForm
          setShowEdit={setEdit}
          bookingId={bookingId}
          reload={loadAllData}
          zoneName={zoneName}
        />
      )}


    </div>
  );
};

export default ReceiverCarDetail;
