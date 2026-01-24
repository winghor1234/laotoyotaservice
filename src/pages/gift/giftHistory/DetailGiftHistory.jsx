import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import Spinner from "../../../utils/Loading";
import { BackButton } from "../../../utils/BackButton";
import { Gift } from "lucide-react";


const DetailGiftHistory = () => {
    const { t } = useTranslation("gift");
    const { id } = useParams();
    const [giftHistoryData, setGiftHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_GIFT_HISTORY(id));
                setGiftHistoryData(res?.data?.data);
            } catch (error) {
                console.error("Error loading gift history details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    console.log("giftHistoryData : ",giftHistoryData);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!giftHistoryData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("no_data")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <BackButton />
                    <hr className="border-gray-200 my-4" />
                    <div className="flex flex-col items-center mb-6">
                        <Gift className="text-2xl text-gray-600" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                            {t("detail_history_title")}
                        </h2>
                    </div>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block px-16">
                        <div className="flex gap-6 items-center justify-start p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_title")} :</p>
                                    <p className="text-base text-gray-900 font-semibold">
                                        {giftHistoryData.giftcard.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_amount")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData?.amount}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_one_point")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData.giftcard.point}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_user_name")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData?.user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_user_phone")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData?.user?.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_user_province")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData?.user?.province}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_user_village")} :</p>
                                    <p className="text-base text-gray-800">{giftHistoryData?.user?.village}</p>
                                </div>
                            </div>
                        </div>
                        {giftHistoryData.giftcard.image && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={giftHistoryData.giftcard.image}
                                    alt="Gift"
                                    className="w-[200px] h-[200px] object-cover rounded-lg shadow"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                       
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("detail_history_title")}:</span>
                                <span className="text-base font-medium text-gray-900">{giftHistoryData?.giftcard?.name}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_amount")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.amount}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_one_point")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.giftcard?.point}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_user_name")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.user?.username}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_user_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.user?.phoneNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_user_province")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.user?.province}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_user_village")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftHistoryData?.user?.village}</span>
                            </div>
                        </div>
                        {giftHistoryData.giftcard.image && (
                            <div className="flex justify-center">
                                <img
                                    src={giftHistoryData.giftcard.image}
                                    alt="Gift"
                                    className="w-[180px] h-[180px] object-cover rounded-md shadow"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailGiftHistory;
