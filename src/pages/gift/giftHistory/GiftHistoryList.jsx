import { Eye, GiftIcon, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import SelectDate from "../../../utils/SelectDate";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import DownloadButton from "../../../utils/DownloadButton";
import ReturnScore from "./ReturnScore";

const GiftHistoryList = () => {
    // const [gifts, setGifts] = useState([]);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [giftHistoryId, setGiftHistoryId] = useState(null);
    const { t } = useTranslation("gift");
    const navigate = useNavigate();

    // const fetchGifts = async () => {
    //     try {
    //         const res = await axiosInstance.get(APIPath.SELECT_ALL_GIFT_HISTORY);
    //         setGifts(res?.data?.data || []);
    //     } catch (error) {
    //         console.error("Error fetching gifts:", error);
    //     }
    // };

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
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            return axiosInstance.get(APIPath.GET_ALL_GIFT_HISTORY, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            });
        },
    });

    const handleToDetailGiftHistory = (id) => {
        navigate(`/user/gift-history-detail/${id}`);
    };

    // const handleReturnScore = async (id) => {
    //     try {
    //         await axiosInstance.post(`${APIPath.DELETE_GIFT_HISTORY}/${id}`);
    //     } catch (error) {
    //         console.error("Error returning score:", error);
    //     }
    // };

    useEffect(() => {
        fetchData();
    }, []);

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
                    <div key={index}  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        {/* Mobile Card Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-gray-600">#{index + 1}</div>
                            <div className="text-sm font-medium text-blue-600">
                                {t("amount")}: {item.amount}
                            </div>
                        </div>

                        {/* Mobile Card Content */}
                        <div className="flex gap-3">
                            {item.giftcard.image ? (
                                <img src={item.giftcard.image} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiftIcon className="text-gray-600 w-8 h-8" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate mb-1">{item.user.username}</h3>
                                <p className="text-sm text-gray-600 truncate">{item.giftcard.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Eye onClick={() => handleToDetailGiftHistory(item.gifthistory_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                <HandCoins onClick={() => {
                                    setGiftHistoryId(item.gifthistory_id);
                                    setShow(true);
                                }} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                {/* Table Header */}
                <div className="w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                    <div className="grid grid-cols-5 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-base lg:text-lg">
                        <div className="flex justify-center items-center">{t("serial")}</div>
                        <div className="flex justify-center items-center">{t("customer_name")}</div>
                        <div className="flex justify-center items-center">{t("gift_name")}</div>
                        <div className="flex justify-center items-center">{t("amount")}</div>
                        <div className="flex justify-center items-center">{t("actions")}</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {giftCardHistory?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div key={index} className="grid grid-cols-5 gap-3 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 items-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {index + 1}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.user.username}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex flex-col justify-center items-center">
                                {item.giftcard.image ? (
                                    <img src={item.giftcard.image} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <GiftIcon className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                )}
                                {item.giftcard.name}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.amount}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-5">
                                <Eye onClick={() => handleToDetailGiftHistory(item.gifthistory_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                <HandCoins onClick={() => {
                                    setGiftHistoryId(item.gifthistory_id);
                                    setShow(true);
                                }}  className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
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
            {/* Return the score */}
            <ReturnScore show={show} onClose={() => setShow(false)} id={giftHistoryId} handleFetch={fetchData} />
        </div>
    );
};

export default GiftHistoryList;
