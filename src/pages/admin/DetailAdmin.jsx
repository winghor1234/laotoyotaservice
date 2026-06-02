import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";

const DetailAdmin = () => {
    const { t } = useTranslation("user");
    const { id } = useParams();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_USER(id));
                setAdminData(res?.data?.data);
            } catch (error) {
                console.error("Error loading admin details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!adminData) {
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
                        <FaUser className="text-2xl text-gray-600" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                            {t("admin_detail")}
                        </h2>
                    </div>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block px-16">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("admin_name")}
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {adminData?.username || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("admin_email")}
                                    </p>
                                    <p className="font-semibold text-gray-900 break-all">
                                        {adminData?.email || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("admin_phone_number")}
                                    </p>
                                    <p className="text-gray-800">
                                        {adminData?.phoneNumber || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("admin_province")}
                                    </p>
                                    <p className="text-gray-800">
                                        {adminData?.province || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("district")}
                                    </p>
                                    <p className="text-gray-800">
                                        {adminData?.district || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("admin_village")}
                                    </p>
                                    <p className="text-gray-800">
                                        {adminData?.village || "-"}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("admin_name")} :</span>
                                <span className="text-base font-medium text-gray-900">{adminData?.username}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("admin_email")} :</span>
                                <span className="text-base font-medium text-gray-900">{adminData?.email}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("admin_phone_number")} :</span>
                                <span className="text-base font-medium text-gray-800">{adminData?.phoneNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("admin_province")} :</span>
                                <span className="text-base font-medium text-gray-800">{adminData?.province}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("admin_village")} :</span>
                                <span className="text-base font-medium text-gray-800">{adminData?.village}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailAdmin;
