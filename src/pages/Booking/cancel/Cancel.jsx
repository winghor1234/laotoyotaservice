import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCheckRole } from "../../../utils/checkRole";
import { useEmployeeBranchId } from "../../../utils/useEmployeeBranchId";
import { useNavigate } from "react-router-dom";
import SelectDate from "../../../utils/SelectDate";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import DownloadButton from "../../../utils/DownloadButton";
import { formatDates } from "../../../utils/FormatDate";

const Cancel = () => {
    const { t } = useTranslation("booking"); // ใช้ namespace "booking"
    // const [booking, setBooking] = useState([]);
    // const [exportData, setExportData] = useState([]);
    const role = useCheckRole();
    const branch_id = useEmployeeBranchId();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);



    const isReady = role === "super_admin" || (!!role && !!branch_id);
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
                    status: "cancel",
                },
            });
        },
    });

    useEffect(() => {
        if (role === "super_admin" || (role && branch_id)) {
            fetchData();
        }
    }, [role, branch_id]);

    const CancelDetail = (id) => {
        // console.log("id cancel  ",id);
        navigate(`/user/cancel-detail/${id}`);
    }


    useEffect(() => {
        fetchData();
    }, [role, branch_id]);



    return (
        <div>
            {/* Search + Date + Export or download */}
            <div className="flex justify-end items-center mb-6">
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

                {/* Desktop/Tablet Table Body */}
                <div className="hidden md:block divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {booking
                        .filter((item) => item.bookingStatus === "cancel")
                        .map((item, index) => (
                            <div
                                key={index}
                                onClick={() => CancelDetail(item.booking_id)}
                                className="grid grid-cols-6 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="bg-red-500 px-4 py-2 text-black rounded-xl text-xs font-semibold text-center min-w-[60px]">
                                        {t("cancelled")}
                                    </span>
                                    <span className="font-medium text-xs md:text-sm lg:text-base line-clamp-1">
                                        {item?.car?.model}
                                    </span>
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center line-clamp-1">
                                    {item?.user?.username}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center line-clamp-1">
                                    {item?.user?.phoneNumber}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center line-clamp-1">
                                    {item?.car?.plateNumber}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center line-clamp-1">
                                    {formatDates(item?.day)}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center line-clamp-1">
                                    {item?.time?.time}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {booking
                        .filter((item) => item.bookingStatus === "cancel")
                        .map((item, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-red-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">
                                        {t("cancelled")}
                                    </span>
                                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.car.model}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{t("customer_name")}:</span>
                                        <span className="text-gray-900 line-clamp-1">{item.user.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{t("customer_phone")}:</span>
                                        <span className="text-gray-900 line-clamp-1">{item.user.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{t("plate_number")}:</span>
                                        <span className="text-gray-900 line-clamp-1">{item.car.plateNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{t("date_label")}:</span>
                                        <span className="text-gray-900 line-clamp-1">{item.time.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{t("time_label")}:</span>
                                        <span className="text-gray-900">{item.time.time}</span>
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

export default Cancel;
