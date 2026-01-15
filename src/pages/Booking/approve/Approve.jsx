import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import BookingSearch from "../../../utils/BookingSearch";
import { useTranslation } from "react-i18next";
import { useCheckRole } from "../../../utils/checkRole";
import { useEmployeeBranchId } from "../../../utils/useEmployeeBranchId";
import { useMemo } from "react";

const Approve = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState([]);
  const [exportData, setExportData] = useState([]);
  const { t } = useTranslation("booking");
  const role = useCheckRole();
  const branch_id = useEmployeeBranchId();


  const fetchBooking = async () => {
    try {
      const apiPath = role === "super_admin"
        ? APIPath.SELECT_ALL_BOOKING
        : APIPath.SELECT_BOOKING_BY_BRANCH(branch_id);

      const res = await axiosInstance.get(apiPath);
      const data = res?.data?.data || [];
      setBooking(data);
      // console.log("booking data:", data);

      setExportData(
        data
          ?.filter((item) => item.bookingStatus === "await")
          .map((item) => ({
            [t("car_model")]: item?.car?.model,
            [t("username")]: item?.user?.username,
            [t("phone")]: item?.user?.phoneNumber,
            [t("plate_number")]: item?.car?.plateNumber,
            [t("date_label")]: item?.time?.date,
            [t("time_label")]: item?.time?.time
          }))
      );
    } catch (error) {
      console.log(error);
    }
  };


  const handleApprove = (BookingId, timeId) => {
    navigate(`/user/receiverCarDetail/${BookingId}?time=${timeId}`);
  };

  const filteredBookings = useMemo(
    () =>
      booking
        .filter((item) => item.bookingStatus === "await")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [booking]
  );

  const handleSearch = async ({ searchText }) => {
    try {
      const res = await axiosInstance.get(`${APIPath.SEARCH_BOOKING}?search=${searchText}`);
      setBooking(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [role, branch_id]);

  return (
    <div className="p-4">
      <BookingSearch onSearch={handleSearch} exportData={exportData} setExportData={setExportData} fetchBooking={fetchBooking}
      />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mt-4">
        {/* Desktop/Tablet Header */}
        <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
          <div className="grid grid-cols-6 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
            <div className="text-center">{t("appointment_info")}</div>
            <div className="text-center">{t("customer_name")}</div>
            <div className="text-center">{t("customer_phone")}</div>
            <div className="text-center">{t("plate_number")}</div>
            <div className="text-center">{t("date_label")}</div>
            <div className="text-center">{t("time_label")}</div>
          </div>
        </div>
        <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {filteredBookings
            .map((item, index) => (
              <div
                key={index}
                onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                className="grid grid-cols-6 gap-2 px-4 py-3 items-center hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 px-4 py-2 text-black rounded-xl text-xs font-semibold">
                    {t("approve_status")}
                  </span>
                  <span className="font-medium text-sm">{item?.car?.model}</span>
                </div>
                <div className="text-sm font-medium text-center">{item?.user?.username}</div>
                <div className="text-sm font-medium text-center">{item?.user?.phoneNumber}</div>
                <div className="text-sm font-medium text-center">{item?.car?.plateNumber}</div>
                <div className="text-sm font-medium text-center">{item?.time?.date_label}</div>
                <div className="text-sm font-medium text-center">{item?.time?.time}</div>
              </div>
            ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-200">
          {booking
            .filter((item) => item.bookingStatus === "await")
            .map((item, index) => (
              <div
                key={index}
                onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between mb-2">
                  <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">
                    {t("approve_status")}
                  </span>
                  <span className="text-sm font-medium">{item?.car?.model}</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("username")}:</span>
                    <span>{item?.user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("phone")}:</span>
                    <span>{item?.user?.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("plate_number")}:</span>
                    <span>{item?.car?.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("date_label")}:</span>
                    <span>{item?.time?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("time_label")}:</span>
                    <span>{item?.time?.time}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Approve;
