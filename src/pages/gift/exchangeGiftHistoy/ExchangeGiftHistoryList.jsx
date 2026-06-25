import { CircleCheckBig, CircleX, Eye, GiftIcon, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import SelectDate from "../../../utils/SelectDate";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import DownloadButton from "../../../utils/DownloadButton";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Confirm from "./PopupConfirm";


const ExchangeGiftHistoryList = () => {
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [giftId, setGiftId] = useState(null);
    const { t } = useTranslation("gift");
    const navigate = useNavigate();

    const {
        data: giftCardHistory,
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
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            return axiosInstance.get(APIPath.GET_ALL_GIFT_HISTORY, {
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

    const handleToDetailGiftHistory = (id) => {
        navigate(`/user/gift-history-detail/${id}`);
    };


    const handleDelete = async (id) => {
        if (!window.confirm(t("confirm_delete"))) return;

        try {
            await axiosInstance.delete(APIPath.CANCEL_GIFT_HISTORY(id));
            SuccessAlert(t("delete_success"), 1500, "success");
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);
    // console.log("giftCardHistory : ", giftCardHistory);

    return (
        <div>
            {/* Top Controls */}
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
                        apiUrl={APIPath.EXPORT_GIFT_HISTORY}
                        fileName="giftHistory-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {giftCardHistory?.map((item, index) => (
                    <div key={index} className=" bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200">
                        {/* Card Header: Index + Status Badge */}
                        <div className="flex items-center justify-between mb-3 ">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                #{index + 1}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${item.status === true && item.received === true
                                ? "bg-yellow-100 text-yellow-700"
                                : item.status === "await"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === "await"
                                    ? "bg-yellow-500"
                                    : item.status === "await"
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                    }`} />
                                 {item.status === "await" ? "ລໍຖ້າຮັບເຄື່ອງ" : "-"}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="flex items-start justify-between gap-3">
                            {/* User & Gift Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate leading-tight">
                                    {t("customer_name")}:  {item.user.username}
                                </h3>
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                    {t("gift_name")}: {item.giftcard.gift_Name}
                                </p>
                                <p className="text-sm font-medium text-blue-600 mt-2">
                                    {t("amount")}: <span className="font-semibold">{item.amount}</span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => handleToDetailGiftHistory(item.gifthistory_id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                    title="View details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.gifthistory_id)}
                                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    title="Delete"
                                >
                                    <CircleX className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setShowConfirm(true); setGiftId(item.gifthistory_id); }}
                                    className="p-2 rounded-lg text-green-400 hover:text-green-600 hover:bg-green-50 transition-colors duration-150"
                                    title="Confirm"
                                >
                                    <IoMdCheckmarkCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                {/* Table Header */}
                <div className="w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                    <div className="grid grid-cols-6 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-base lg:text-lg">
                        <div className="flex justify-center items-center">{t("serial")}</div>
                        <div className="flex justify-center items-center">{t("customer_name")}</div>
                        <div className="flex justify-center items-center">{t("gift_name")}</div>
                        <div className="flex justify-center items-center">{t("amount")}</div>
                        <div className="flex justify-center items-center">{t("status")}</div>
                        <div className="flex justify-center items-center">{t("actions")}</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {giftCardHistory?.map((item, index) => (
                        <div key={index} className="grid grid-cols-6 gap-3 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 items-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {index + 1}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.user.username}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex flex-col justify-center items-center">
                                {item.giftcard.gift_Name}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.amount}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center bg-yellow-500 rounded-4xl py-1">
                                {item.status === "await" ? t("await") : "-"}
                            </div>
                            <div className=" text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-5">
                                <Eye onClick={() => handleToDetailGiftHistory(item.gifthistory_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                <CircleX
                                    onClick={() => { handleDelete(item.gifthistory_id); }}
                                    className="w-4 h-4 md:w-5 md:h-5 text-red-500 hover:text-red-700 cursor-pointer duration-200" />
                                <IoMdCheckmarkCircle
                                    onClick={() => { setShowConfirm(true), setGiftId(item.gifthistory_id) }}
                                    className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer duration-200" />
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
            {/* Confirm */}
            {showConfirm && (
                <Confirm
                    show={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    Id={giftId}
                    handleFetch={fetchData}
                />
            )}
        </div>
    );
};

export default ExchangeGiftHistoryList;
