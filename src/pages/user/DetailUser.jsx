import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";


const DetailUser = () => {
    const { t } = useTranslation("user");
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_USER(id));
                setUserData(res?.data?.data);
            } catch (error) {
                console.error("Error loading user details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!userData) {
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
                            {t("user_detail")}
                        </h2>
                    </div>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block px-16">
                        <div className="flex gap-6 items-center justify-start p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("user_name")} :</p>
                                    <p className="text-base text-gray-900 font-semibold">{userData?.username}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("user_email")} :</p>
                                    <p className="text-base text-gray-900 font-semibold">{userData?.email}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("user_phone_number")} :</p>
                                    <p className="text-base text-gray-800">{userData?.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("user_province")} :</p>
                                    <p className="text-base text-gray-800">{userData?.province}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("user_village")} :</p>
                                    <p className="text-base text-gray-800">{userData?.village}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("user_name")} :</span>
                                <span className="text-base font-medium text-gray-900">{userData?.username}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("user_email")} :</span>
                                <span className="text-base font-medium text-gray-900">{userData?.email}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("user_phone_number")} :</span>
                                <span className="text-base font-medium text-gray-800">{userData?.phoneNumber}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("user_province")} :</span>
                                <span className="text-base font-medium text-gray-800">{userData?.province}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("user_village")} :</span>
                                <span className="text-base font-medium text-gray-800">{userData?.village}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailUser;
