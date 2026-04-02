import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
// import BookingSearch from "../../../utils/BookingSearch";
import logo from "../../../assets/corrects.png";
import { useTranslation } from "react-i18next";
import { useCheckRole } from "../../../utils/checkRole";
import { useEmployeeBranchId } from "../../../utils/useEmployeeBranchId";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import SelectDate from "../../../utils/SelectDate";
import DownloadButton from "../../../utils/DownloadButton";
import { formatDates } from "../../../utils/FormatDate";

const Success = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("booking");
    const role = useCheckRole();
    const branch_id = useEmployeeBranchId();
    const [open, setOpen] = useState(false);


    const isReady = role === "super_admin" || (!!role && !!branch_id);
    const {
        data: fix,
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
                    ? APIPath.GET_ALL_FIX
                    : APIPath.GET_ALL_FIX_BY_BRANCH(branch_id);
            return axiosInstance.get(apiPath, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                    status: "success",
                },
            });
        },
    });

    useEffect(() => {
        if (role === "super_admin" || (role && branch_id)) {
            fetchData();
            // handleFetch();
        }
    }, [role, branch_id]);



    // Export Data 
    // const exportData = booking
    //     ?.filter((item) => item.bookingStatus === "success")
    //     .map((item) => ({
    //         [t("car_model")]: item?.car?.model,
    //         [t("username")]: item?.user?.username,
    //         [t("phone")]: item?.user?.phoneNumber,
    //         [t("plate_number")]: item?.car?.plateNumber,
    //         [t("date_label")]: item?.time?.date,
    //         [t("time_label")]: item?.time?.time,
    //     }));


    const fixDetail = (id) => {
        const fixId = fix.find((f) => f.bookingId === id)?.fix_id;
        if (!fixId) return;
        navigate(`/user/successDetail/${fixId}`);
    };

    return (
        <div>
            {/* <BookingSearch onSearch={handleSearch} exportData={exportData} setExportData={setExportData} fetchBooking={fetchData} /> */}
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
                        <div className="text-center">{t("booking")}</div>
                        <div className="text-center">{t("customerName")}</div>
                        <div className="text-center">{t("phone")}</div>
                        <div className="text-center">{t("plate")}</div>
                        <div className="text-center">{t("date_label")}</div>
                        <div className="text-center">{t("time_label")}</div>
                    </div>
                </div>

                {/* Desktop/Tablet Body */}
                <div className="hidden md:block divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {fix?.filter((item) => item.fixStatus === "success").map((item, index) => (
                        <div
                            key={index}
                            onClick={() => fixDetail(item.bookingId)}
                            className="grid grid-cols-6 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer text-xs md:text-sm lg:text-base"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img src={logo} alt="success" className="h-full w-full object-contain" />
                                </div>
                                <span className="line-clamp-1">{item?.booking?.car?.model}</span>
                            </div>
                            <div className="text-center line-clamp-1">{item?.booking?.user?.username}</div>
                            <div className="text-center line-clamp-1">{item?.booking?.user?.phoneNumber}</div>
                            <div className="text-center line-clamp-1">{item?.booking?.car?.plateNumber}</div>
                            <div className="text-center line-clamp-1">{formatDates(item?.booking?.day)}</div>
                            <div className="text-center line-clamp-1">{item?.booking?.time?.time}</div>
                        </div>
                    ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {fix?.filter((item) => item.fixStatus === "success").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div
                            key={index}
                            // onClick={() => fixDetail(item.booking_id)}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img src={logo} alt="success" className="h-8 w-8 object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base text-gray-900">{item?.booking?.car?.model}</h3>
                                    <p className="text-gray-600 text-sm">{item?.booking?.user?.username}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("phone")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.booking?.user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("plate")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.booking?.car?.plateNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("date_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.booking?.time?.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("time_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.booking?.time?.time}</span>
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

export default Success;
