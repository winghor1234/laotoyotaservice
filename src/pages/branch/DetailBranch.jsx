// src/pages/branch/DetailBranchPage.jsx
import { FaBuilding } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";

const DetailBranch = () => {
    const { t } = useTranslation("branch");
    const { id } = useParams();
    const [branchData, setBranchData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_BRANCH(id));
                setBranchData(res?.data?.data);
            } catch (error) {
                console.error("Error loading branch details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBranch();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!branchData) {
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
                        {t("branch_detail")}
                    </h2>

                    {/* Desktop / Tablet View */}
                    <div className="hidden md:block">
                        <div className="flex gap-6 items-center justify-around p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-gray-100 w-14 h-14 flex items-center justify-center rounded-full shadow">
                                    <FaBuilding className="text-2xl text-gray-600" />
                                </div>
                                <p className="text-base text-gray-500">{t("branch_detail")}</p>
                            </div>
                            <div className="flex flex-col gap-2 text-left">
                                <div>
                                    <p className="text-base text-gray-500">{t("branch_title")}</p>
                                    <p className="text-base text-gray-900 font-semibold">{branchData.branch_name}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("branch_location")}</p>
                                    <p className="text-base text-gray-800">{branchData.location}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-500">{t("branch_phone")}</p>
                                    <p className="text-base text-gray-800">{branchData.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <FaBuilding className="text-xl text-gray-600" />
                            </div>
                            <p className="text-base text-gray-500">{t("branch_details")}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_title")}:</span>
                                <span className="text-base font-medium text-gray-900">{branchData.branch_name}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_location")}:</span>
                                <span className="text-base font-medium text-gray-800">{branchData.location}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
                                <span className="text-base font-medium text-gray-800">{branchData.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBranch;
