import { FaIdCard } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { useTranslation } from "react-i18next";

const CardDetail = () => {
    const { t } = useTranslation("card");
    const { id } = useParams();

    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(
                    APIPath.SELECT_ONE_CARD(id)
                );

                setCardData(res?.data?.data);
            } catch (error) {
                console.error("Error loading card detail:", error);
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

    if (!cardData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("no_data")}
            </div>
        );
    }

    console.log("Card Detail Data: ", cardData);

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <BackButton />

                    <hr className="border-gray-200 my-4" />

                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <FaIdCard className="text-3xl text-gray-600" />

                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                            {t("card_detail")}
                        </h2>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left */}
                            <div className="space-y-4 bg-gray-50 p-5 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("card_number")}
                                    </p>

                                    <p className="text-base font-semibold text-gray-900">
                                        {cardData.card_number || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("customer_number")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData?.car?.user?.customer_number || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("vip_number")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData.vip_number || "-"}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("card_type")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData.card_type || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("plate_number")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData?.car?.plateNumber || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="space-y-4 bg-gray-50 p-5 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("vehicle_model")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData?.car?.model || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("color")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData?.car?.color || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("frame_number")}
                                    </p>

                                    <p className="text-base text-gray-800 break-all">
                                        {cardData?.car?.frameNumber || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("engine_number")}
                                    </p>

                                    <p className="text-base text-gray-800 break-all">
                                        {cardData?.car?.engineNumber || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("active_point")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData.active_point || 0}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("total_point")}
                                    </p>

                                    <p className="text-base text-gray-800">
                                        {cardData.total_point || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-500 text-sm">
                                    {t("issued_date")}
                                </p>

                                <p className="text-base text-gray-800">
                                    {cardData.issued_date
                                        ? new Date(
                                            cardData.issued_date
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-500 text-sm">
                                    {t("expiration_date")}
                                </p>

                                <p className="text-base text-gray-800">
                                    {cardData.expiration_date
                                        ? new Date(
                                            cardData.expiration_date
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-500 text-sm">
                                    {t("goldIssued")}
                                </p>

                                <p className="text-base text-gray-800">
                                    {cardData.goldIssued
                                        ? new Date(
                                            cardData.goldIssued
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
                            <DetailItem
                                label={t("card_number")}
                                value={cardData.card_number}
                            />

                            <DetailItem
                                label={t("customer_number")}
                                value={cardData?.car?.user?.customer_number || "-"}
                            />

                            <DetailItem
                                label={t("vip_number")}
                                value={cardData.vip_number}
                            />

                            <DetailItem
                                label={t("card_type")}
                                value={cardData.card_type}
                            />

                            <DetailItem
                                label={t("plate_number")}
                                value={cardData?.car?.plateNumber || "-"}
                            />

                            <DetailItem
                                label={t("vehicle_model")}
                                value={cardData?.car?.model || "-"}
                            />

                            <DetailItem
                                label={t("color")}
                                value={cardData?.car?.color || "-"}
                            />

                            <DetailItem
                                label={t("frame_number")}
                                value={cardData?.car?.frameNumber || "-"}
                            />

                            <DetailItem
                                label={t("engine_number")}
                                value={cardData?.car?.engineNumber || "-"}
                            />

                            <DetailItem
                                label={t("active_point")}
                                value={cardData.active_point || 0}
                            />

                            <DetailItem
                                label={t("total_point")}
                                value={cardData.total_point || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => {
    return (
        <div>
            <span className="text-sm text-gray-500 block">{label}</span>

            <span className="text-base font-medium text-gray-900 break-all">
                {value || "-"}
            </span>
        </div>
    );
};

export default CardDetail;