
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckRole } from "../../../utils/checkRole";
import { useEmployeeBranchId } from "../../../utils/useEmployeeBranchId";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { useEffect, useState } from "react";
import SelectDate from "../../../utils/SelectDate";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import DownloadButton from "../../../utils/DownloadButton";
import {  formatDates } from "../../../utils/FormatDate";



const Approve = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("booking");
  const role = useCheckRole();
  const branch_id = useEmployeeBranchId();
  const [open, setOpen] = useState(false);



  // ===============================
  // useServerFilterPagination
  // ===============================
  const isReady = role === "super_admin" || !!branch_id;
  const {
    data: booking,
    page,
    totalPage,
    search,
    handleSearch,
    handleDateChange,
    handlePageChange,
    fetchData,
    getPageNumbers,
  } = useServerFilterPagination({
    enabled: isReady,
    apiCall: ({ page, limit, search, startDate, endDate }) => {
      const apiPath =
        role === "super_admin"
          ? APIPath.GET_ALL_BOOKING
          : APIPath.GET_ALL_BOOKING_BY_BRANCH(branch_id);
      return axiosInstance.get(apiPath, {
        params: {
          page,
          limit,
          search: search || undefined,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          status: "await",
        },
      });
    },
  });

  useEffect(() => {
    if (role === "super_admin" || (role && branch_id)) {
      fetchData();
    }
  }, [role, branch_id]);


  // console.log("Booking data:", booking);

  // Navigate Approve
  const handleApprove = (BookingId, timeId) => {
    navigate(`/user/receiverCarDetail/${BookingId}?time=${timeId}`);
  };

  return (
    <div>
      {/* Search + Date + Export or download */}
      <div className="flex mb-6 gap-9 justify-end items-center">
        <SelectDate
          searchValue={search}
          onSearchChange={handleSearch}
          onDateChange={handleDateChange}
        />
        {/* download button */}
        <DownloadButton open={open} setOpen={setOpen} />
        {open && (
          <ExportExcelPopup
            apiUrl={APIPath.EXPORT_BOOKING}
            fileName="booking-report.xlsx"
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mt-4">
        {/* Desktop Header */}
        <div className="hidden md:block w-full h-12 md:h-12 lg:h-14 bg-[#E52020] text-white">
          <div className="grid grid-cols-6 gap-4 px-4 py-4 font-medium text-sm">
            <div className="flex justify-center items-center">{t("appointment_info")}</div>
            <div className="flex justify-center items-center">{t("customer_name")}</div>
            <div className="flex justify-center items-center">{t("customer_phone")}</div>
            <div className="flex justify-center items-center">{t("plate_number")}</div>
            <div className="flex justify-center items-center">{t("date_label")}</div>
            <div className="flex justify-center items-center">{t("time_label")}</div>
          </div>
        </div>

        {/* Desktop List */}
        <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {booking
            ?.filter((item) => item.bookingStatus === "await")
            ?.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleApprove(item?.booking_id, item?.time?.time_id)
                }
                className="grid grid-cols-6 gap-2 px-4 py-3 items-center hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 px-4 py-2 text-black rounded-xl text-xs font-semibold">
                    {t("approve_status")}
                  </span>
                  <span className="font-medium text-sm line-clamp-1">
                    {item?.car?.model}
                  </span>
                </div>
                <div className="text-sm text-center">
                  {item?.user?.username}
                </div>
                <div className="text-sm text-center">
                  {item?.user?.phoneNumber}
                </div>
                <div className="text-sm text-center">
                  {item?.car?.plateNumber}
                </div>
                <div className="text-sm text-center">
                  {formatDates(item?.day)}
                </div>
                <div className="text-sm text-center">
                  {item?.time?.time}
                </div>
              </div>
            ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-200">
          {booking
            ?.filter((item) => item.bookingStatus === "await")
            ?.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleApprove(item?.booking_id, item?.time?.time_id)
                }
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between mb-2">
                  <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">
                    {t("approve_status")}
                  </span>
                  <span className="text-sm font-medium">
                    {item?.car?.model}
                  </span>
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

      {/* Pagination (แก้ไขให้โชว์แค่บางช่วงหน้า) */}
      <div className="flex justify-end mt-4 gap-2 items-center">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          ‹
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {p}
          </button>
        ))}

        {/* ปุ่มถัดไป */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPage || totalPage === 0}
          className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0
            ? "bg-gray-100 text-gray-400"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Approve;