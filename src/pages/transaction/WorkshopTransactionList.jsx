import { useEffect, useState } from "react";
import { Trash, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import SelectDate from "../../utils/SelectDate";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import DownloadButton from "../../utils/DownloadButton";
import ExportExcelPopup from "../../utils/exportExelPopup";
import TransactionButton from "../../utils/TransactionButton";
import { useCheckRole } from "../../utils/checkRole";
import { useEmployeeBranchId } from "../../utils/useEmployeeBranchId";
import { formatDates } from "../../utils/FormatDate";
import ImportExcel from "../../utils/ImportExel";
import { FaCheckCircle } from "react-icons/fa";
import WorkShopFixDetail from "../workshopRepair/WorkShopFixDetail";
import { useNavigate } from "react-router-dom";
import WorkshopTransactionFixDetail from "./WorkshopTransactionFixDetail";

const WorkshopTransactionList = () => {
    const { t } = useTranslation("booking");
    const navigate = useNavigate();
    const role = useCheckRole();
    const branch_id = useEmployeeBranchId();
    const [open, setOpen] = useState(false);

    const isReady = role === "super_admin" || (!!role && !!branch_id);

    const {
        data: transactions,
        page,
        totalPage,
        search,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
        totalCount,
        rangeStart,
        rangeEnd,
        inputPage,
        handleInputPageChange,
    } = useServerFilterPagination({
        enabled: isReady,
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            const apiPath = role === "super_admin"
                ? APIPath.GET_ALL_FIX_FROM_WORKSHOP
                : APIPath.GET_ALL_FIX_BY_BRANCH_FROM_WORKSHOP(branch_id);
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
    console.log("transactions", transactions);

    useEffect(() => {
        if (role === "super_admin" || (role && branch_id)) {
            fetchData();
        }
    }, [role, branch_id]);

    const WorkshopTransactionFixDetail = async (id) => {
        try {
            navigate(`/user/transaction-workshop-detail/${id}`);
        } catch (error) {
            console.log(error);
        }

    };


    return (
        <div>
            <div className="flex justify-end items-center mb-6 gap-2">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                {/* download button */}
                <DownloadButton open={open} setOpen={setOpen} />
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_WORKSHOP_FIX}
                        fileName="booking-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mt-4">
                {/* Desktop/Tablet Header */}
                <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                    <div className="grid grid-cols-7 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
                        <div className="text-center">{t("booking")}</div>
                        <div className="text-center">{t("customerName")}</div>
                        <div className="text-center">{t("phone")}</div>
                        <div className="text-center">{t("plate")}</div>
                        <div className="text-center">{t("date_label")}</div>
                        <div className="text-center">{t("time_label")}</div>
                        <div className="text-center">{t("action_label")}</div>
                    </div>
                </div>

                {/* Desktop/Tablet Body */}
                <div className="hidden md:block divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {transactions?.filter((item) => item.bookingId === null).map((item, index) => (
                        <div key={index} className="grid grid-cols-7 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer text-xs md:text-sm lg:text-base">
                            <div className="flex items-center gap-2 md:gap-3">
                                <FaCheckCircle className="text-green-500 h-7 w-7 shrink-0" />
                                <span className="line-clamp-1">{item?.card?.car?.model}</span>
                            </div>
                            <div className="text-center line-clamp-1">{item?.card?.user?.username}</div>
                            <div className="text-center line-clamp-1">{item?.card?.user?.phoneNumber}</div>
                            <div className="text-center line-clamp-1">{item?.card?.car?.plateNumber}</div>
                            <div className="text-center line-clamp-1">{formatDates(item?.createdAt)}</div>
                            <div className="text-center line-clamp-1">
                                {item?.createdAt
                                    && new Date(item.createdAt).toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })
                                }
                            </div>
                            <div className="flex items-center justify-center">
                                <Eye onClick={() => WorkshopTransactionFixDetail(item.fix_id)} className="text-gray-600 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {transactions?.filter((item) => item.bookingId === null).map((item, index) => (
                        <div
                            key={index}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaCheckCircle className="text-green-500 h-7 w-7 shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base text-gray-900">{item?.card?.car?.model}</h3>
                                        <p className="text-gray-600 text-sm">{item?.card?.user?.username}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("phone")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.card?.user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("plate")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.card?.car?.plateNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("date_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{formatDates(item?.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("time_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.createdAt && new Date(item?.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("action_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">
                                        <Eye onClick={() => WorkshopTransactionFixDetail(item.fix_id)} className="text-gray-600 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination (แก้ไขให้โชว์แค่บางช่วงหน้า) */}
            <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">

                {/* ສະແດງ range */}
                <div className="text-sm text-gray-500">
                    {t("list")}{" "}
                    <span className="font-semibold text-gray-700">{rangeStart} - {rangeEnd}</span>
                    {" "}{t("from")}{" "}
                    <span className="font-semibold text-gray-700">{totalCount}</span>
                    {" "}{t("list")}
                </div>

                <div className="flex gap-4 items-center">

                    {/* ໄປໜ້າ input */}
                    <span className="text-sm text-gray-500">{t("to")}:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPage}
                        value={inputPage}
                        onChange={(e) => handleInputPageChange(e.target.value)}
                        className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-500">{t("from")} {totalPage}</span>

                    {/* ‹‹ ໜ້າທຳອິດ */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ‹‹
                    </button>

                    {/* ‹ ຖອຍຫຼັງ */}
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ‹
                    </button>

                    {/* ເລກໜ້າ */}
                    {getPageNumbers().map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* › ໜ້າຕໍ່ໄປ */}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPage || totalPage === 0}
                        className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ›
                    </button>

                    {/* ›› ໜ້າສຸດທ້າຍ */}
                    <button
                        onClick={() => handlePageChange(totalPage)}
                        disabled={page === totalPage || totalPage === 0}
                        className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ››
                    </button>

                </div>
            </div>
        </div>
    );
};

export default WorkshopTransactionList;