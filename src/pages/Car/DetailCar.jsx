// src/pages/branch/DetailBranchPage.jsx
import { FaBuilding } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import { Car } from "lucide-react";


const DetailCar = () => {
    const { t } = useTranslation("car");
    const { id } = useParams();
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_CAR(id));
                setCarData(res?.data?.data);
            } catch (error) {
                console.error("Error loading car details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!carData) {
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
                        <Car className="text-4xl text-gray-600" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                            {t("car_detail")}
                        </h2>
                    </div>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block px-16">
                        <div className="flex gap-6 items-start justify-start p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("model")} :</p>
                                    <p className="text-base text-gray-900 font-semibold">{carData.model}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("plate")} :</p>
                                    <p className="text-base text-gray-800">{carData.plateNumber}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("color")} :</p>
                                    <p className="text-base text-gray-800">{carData.color}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("engine")} :</p>
                                    <p className="text-base text-gray-800">{carData.engineNumber}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("frame")} :</p>
                                    <p className="text-base text-gray-800">{carData.frameNumber}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("province")} :</p>
                                    <p className="text-base text-gray-800">{carData.province}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_title")}:</span>
                                <span className="text-base font-medium text-gray-900">{carData.model}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_location")}:</span>
                                <span className="text-base font-medium text-gray-800">{carData.plateNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{carData.color}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{carData.engineNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{carData.frameNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{carData.province}</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailCar;
