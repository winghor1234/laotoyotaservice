import { FaTools } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import axiosInstance from "../../../utils/AxiosInstance";
import { BackButton } from "../../../utils/BackButton";
import APIPath from "../../../api/APIPath";
import { Gift } from "lucide-react";

const DetailGift = () => {
    const { t } = useTranslation("gift");
    const { id } = useParams();
    const [giftData, setGiftData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_GIFT(id));
                setGiftData(res?.data?.data);
            } catch (error) {
                console.error("Error loading gift details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!giftData) {
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
                            {t("detail_title")}
                        </h2>
                    </div>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block px-16">
                        <div className="flex gap-6 items-center justify-start p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_title")} :</p>
                                    <p className="text-base text-gray-900 font-semibold">
                                        {giftData.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_amount")} :</p>
                                    <p className="text-base text-gray-800">{giftData.amount}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("gift_point")} :</p>
                                    <p className="text-base text-gray-800">{giftData.point}</p>
                                </div>
                            </div>
                        </div>
                        {giftData.image && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={giftData.image}
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
                                <span className="text-base text-gray-500 block">{t("gift_title")}:</span>
                                <span className="text-base font-medium text-gray-900">{giftData.name}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_amount")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftData.amount}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("gift_detail")}:</span>
                                <span className="text-base font-medium text-gray-800">{giftData.point}</span>
                            </div>
                        </div>
                        {giftData.image && (
                            <div className="flex justify-center">
                                <img
                                    src={giftData.image}
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

export default DetailGift;
