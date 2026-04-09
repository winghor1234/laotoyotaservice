import { Edit, Eye, GiftIcon, Trash } from "lucide-react";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import { useEffect, useState } from "react";
import EditReward from "./EditGift";
import AddReward from "./AddGift";
import SelectDate from "../../../utils/SelectDate";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next"; // import i18n hook
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import DownloadButton from "../../../utils/DownloadButton";
import ExchangeGift from "./exchangeGift";

const GiftList = () => {
    const { t } = useTranslation("gift");
    const navigate = useNavigate();
    const [showEditReward, setShowEditReward] = useState(false);
    const [showAddReward, setShowAddReward] = useState(false);
    const [giftId, setGiftId] = useState(null);
    const [open, setOpen] = useState(false);
    const [showExchangeGift, setShowExchangeGift] = useState(false);
    const {
        data: gift,
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
            return axiosInstance.get(APIPath.GET_ALL_GIFT_CARD, {
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("delete_confirm_title"),
            t("delete_success_title")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_GIFT(id));
            fetchData();
        }
    };

    const handleToDetailGift = (id) => {
        navigate(`/user/gift-detail/${id}`);
    };



    return (
        <div>
            <div className="flex justify-end items-center mb-6">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                <button onClick={() => setShowExchangeGift(true)} className="bg-green-600 hover:bg-green-700 transition-colors w-full sm:w-auto px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base">
                    {t("exchange_gift_button")}
                </button>
                {/* download button */}
                <DownloadButton open={open} setOpen={setOpen} />
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_GIFT_CARD}
                        fileName="giftCard-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                <button onClick={() => setShowAddReward(true)} className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base">
                    {t("add_reward_button")}
                </button>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {gift?.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <div  className="flex items-center justify-between mb-3">
                            <div  className="text-sm font-medium text-gray-600">{index + 1}</div>
                            <div className="flex items-center gap-3">
                                <Eye onClick={() => handleToDetailGift(item.giftcard_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                <Edit className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" onClick={(e) => { e.stopPropagation(); setShowEditReward(true); setGiftId(item.giftcard_id); }} />
                                <Trash className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" onClick={(e) => { e.stopPropagation(); handleDelete(item.giftcard_id); }} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 line-clamp-2" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiftIcon className="text-gray-600 w-8 h-8" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{t("point")}:</span>
                                    <span className="text-sm font-medium text-blue-600">{item.point}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                    <div className="grid grid-cols-5 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-base lg:text-lg">
                        <div className="flex justify-center items-center">{t("serial")}</div>
                        <div className="flex justify-center items-center">{t("image")}</div>
                        <div className="flex justify-center items-center">{t("gift_name")}</div>
                        <div className="flex justify-center items-center">{t("point")}</div>
                        <div className="flex justify-center items-center">{t("actions")}</div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {gift?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div key={index} className="grid grid-cols-5 gap-3 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 items-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {index + 1}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <GiftIcon className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-2 ">{item.name}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{item.point}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-3 md:gap-6">
                                <Eye onClick={() => handleToDetailGift(item.giftcard_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                                <Edit className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" onClick={(e) => { e.stopPropagation(); setShowEditReward(true); setGiftId(item.giftcard_id); }} />
                                <Trash className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" onClick={(e) => { e.stopPropagation(); handleDelete(item.giftcard_id); }} />
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

            {/* Edit & Add Reward Popups */}
            <EditReward show={showEditReward} onClose={() => setShowEditReward(false)} giftId={giftId} handleFetch={fetchData} />
            <AddReward show={showAddReward} onClose={() => setShowAddReward(false)} handleFetch={fetchData} />
            <ExchangeGift show={showExchangeGift} onClose={() => setShowExchangeGift(false)} handleFetch={fetchData} />
        </div>
    );
};

export default GiftList;
