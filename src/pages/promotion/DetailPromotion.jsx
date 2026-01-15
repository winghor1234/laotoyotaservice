import { FaTools } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { useTranslation } from "react-i18next";

const DetailPromotion = () => {
    const { t } = useTranslation("promotion");
    const { id } = useParams();
    const [promotionData, setPromotionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_PROMOTION(id));
                setPromotionData(res?.data?.data);
            } catch (error) {
                console.error("Error loading promotion details:", error);
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

    if (!promotionData) {
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
                    <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                        {t("promotion_detail")}
                    </h2>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block">
                        <div className="flex gap-6 items-center justify-around p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-gray-100 w-14 h-14 flex items-center justify-center rounded-full shadow">
                                    <FaTools className="text-2xl text-gray-600" />
                                </div>
                                <p className="text-base text-gray-500">{t("promotion_detail")}</p>
                            </div>
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("promotion_title")}</p>
                                    <p className="text-base text-gray-900 font-semibold">
                                        {promotionData.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("promotion_detail")}</p>
                                    <p className="text-base text-gray-800">{promotionData.detail}</p>
                                </div>
                            </div>
                        </div>
                        {promotionData.image && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={promotionData.image}
                                    alt="Promotion"
                                    className="w-[200px] h-[200px] object-cover rounded-lg shadow"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <FaTools className="text-xl text-gray-600" />
                            </div>
                            <p className="text-base text-gray-500">{t("promotion_detail")}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("promotion_title")}:</span>
                                <span className="text-base font-medium text-gray-900">{promotionData.title}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("promotion_detail")}:</span>
                                <span className="text-base font-medium text-gray-800">{promotionData.detail}</span>
                            </div>
                        </div>
                        {promotionData.image && (
                            <div className="flex justify-center">
                                <img
                                    src={promotionData.image}
                                    alt="Promotion"
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

export default DetailPromotion;
