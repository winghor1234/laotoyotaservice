import { Edit, Eye, GiftIcon, Trash } from "lucide-react";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import { useEffect, useState } from "react";
import EditReward from "./EditGift";
import AddReward from "./AddGift";
import SelectDate from "../../../utils/SelectDate";
import { filterByDateRange } from "../../../utils/FilterDate";
import { filterSearch } from "../../../utils/FilterSearch";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next"; // import i18n hook

const GiftList = () => {
    const { t } = useTranslation("gift"); // ใช้ hook สำหรับแปลข้อความ

    const [showEditReward, setShowEditReward] = useState(false);
    const [showAddReward, setShowAddReward] = useState(false);
    const [gifts, setGifts] = useState([]);
    const [giftId, setGiftId] = useState(null);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchGifts = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_GIFT);
            setGifts(res?.data?.data || []);
        } catch (error) {
            console.error("Error fetching gifts:", error);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("delete_confirm_title"),
            t("delete_success_title")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_GIFT(id));
            fetchGifts();
        }
    };

    const filteredGifts = filterByDateRange(
        filterSearch(gifts, "name", search),
        startDate,
        endDate,
        "createdAt"
    );

    return (
        <div>
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("search_placeholder")}
                    onDateChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                />
                <div onClick={() => setShowAddReward(true)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-10 py-2.5 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base">
                        {t("add_reward_button")}
                    </button>
                </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {filteredGifts?.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-gray-600">#{index + 1}</div>
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4" />
                                <Edit className="w-4 h-4" onClick={() => { setShowEditReward(true); setGiftId(item.giftcard_id); }} />
                                <Trash className="w-4 h-4" onClick={() => handleDelete(item.giftcard_id)} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GiftIcon className="text-gray-600 w-8 h-8" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
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
                    {filteredGifts?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
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
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{item.name}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{item.point}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-3 md:gap-6">
                                <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                <Edit className="w-4 h-4 md:w-5 md:h-5" onClick={() => { setShowEditReward(true); setGiftId(item.giftcard_id); }} />
                                <Trash className="w-4 h-4 md:w-5 md:h-5" onClick={() => handleDelete(item.giftcard_id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit & Add Reward Popups */}
            <EditReward show={showEditReward} onClose={() => setShowEditReward(false)} giftId={giftId} handleFetch={fetchGifts} />
            <AddReward show={showAddReward} onClose={() => setShowAddReward(false)} handleFetch={fetchGifts} />
        </div>
    );
};

export default GiftList;
