import { FaArrowLeft, FaTools } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../utils/Loading";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DetailService = () => {
    const { t } = useTranslation("service");
    const { id } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_SERVICE(id));
                setServiceData(res?.data?.data);
            } catch (error) {
                console.error("Error loading service details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_service")} />
            </div>
        );
    }

    if (!serviceData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("service_not_found")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4"
                    >
                        <button className="flex items-center gap-2 text-gray-700 hover:text-black">
                            <FaArrowLeft className="text-sm sm:text-base" />
                            <span className="font-medium text-sm sm:text-lg lg:text-xl">
                                {t("back")}
                            </span>
                        </button>
                    </div>

                    <hr className="border-gray-200 my-4" />
                    <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                        {t("service_detail")}
                    </h2>

                    {/* Desktop / Tablet */}
                    <div className="hidden md:block">
                        <div className="flex gap-6 items-center justify-around p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-gray-100 w-14 h-14 flex items-center justify-center rounded-full shadow">
                                    <FaTools className="text-2xl text-gray-600" />
                                </div>
                                <p className="text-base text-gray-500">{t("service_info")}</p>
                            </div>

                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("service_name")}</p>
                                    <p className="text-base text-gray-900 font-semibold">
                                        {serviceData.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("service_description")}</p>
                                    <p className="text-base text-gray-800">{serviceData.detail}</p>
                                </div>
                            </div>
                        </div>

                        {serviceData.image && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={serviceData.image}
                                    alt="Service"
                                    className="w-[200px] h-[200px] object-cover rounded-lg shadow"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <FaTools className="text-xl text-gray-600" />
                            </div>
                            <p className="text-base text-gray-500">{t("service_info")}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("name")}:</span>
                                <span className="text-base font-medium text-gray-900">
                                    {serviceData.title}
                                </span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("description")}:</span>
                                <span className="text-base font-medium text-gray-800">
                                    {serviceData.detail}
                                </span>
                            </div>
                        </div>

                        {serviceData.image && (
                            <div className="flex justify-center">
                                <img
                                    src={serviceData.image}
                                    alt="Service"
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

export default DetailService;
