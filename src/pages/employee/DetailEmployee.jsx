import { FaUser, FaIdBadge, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";

const DetailEmployee = () => {
    const { t } = useTranslation("employee");
    const { id } = useParams();
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_EMPLOYEE(id));
                setEmployeeData(res?.data?.data);
            } catch (error) {
                console.error("Error loading employee details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    if (!employeeData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
                {t("no_data")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header Section */}
                <div className="p-6 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <BackButton />
                    </div>

                    <div className="flex flex-col items-center py-4">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                            <FaUser className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {t("employee_detail")}
                        </h2>
                    </div>
                </div>

                {/* Content Section - Improved Grid */}
                <div className="p-6 sm:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Info Item: Name */}
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-red-500"><FaIdBadge size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase">{t("employee_name")}</p>
                                <p className="text-lg text-gray-900 font-semibold">{employeeData.employee_name}</p>
                            </div>
                        </div>

                        {/* Info Item: Position */}
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-red-500"><FaUserCircle size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase">{t("position")}</p>
                                <p className="text-lg text-gray-800 font-semibold">{employeeData.position}</p>
                            </div>
                        </div>

                        {/* Info Item: Branch */}
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-red-500"><FaMapMarkerAlt size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase">{t("branch")}</p>
                                <p className="text-lg text-gray-800 font-semibold">
                                    {/* แสดงชื่อสาขา ถ้าไม่มีให้โชว์ "-" */}
                                    {employeeData.branch?.branch_name || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Info Item: Linked Account */}
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-red-500"><FaUser size={18} /></div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase">{t("user")}</p>
                                <p className="text-lg text-gray-800 font-semibold">
                                    {/* แสดง Username ของระบบ */}
                                    {employeeData.user?.username || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                
                </div>

            </div>
        </div>
    );
};

export default DetailEmployee;