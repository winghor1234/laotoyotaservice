import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { formatDates } from "../../utils/FormatDate";
import { FormatNumber } from "../../utils/FormatNumber";


const WorkShopFixDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("booking");
    const [data, setData] = useState(null);
    const [branch, setBranch] = useState(null);
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. ดึงข้อมูล Fix (Bill) ก่อน
                const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
                const fixData = fixRes?.data?.data;

                if (fixData) {
                    setData(fixData);
                    const empId = fixData.createBy; // ดึง ID ออกมาพักไว้ในตัวแปร


                    // 2. ตรวจสอบว่ามี empId ไหม ถ้ามีให้ดึงข้อมูล Employee ต่อทันที
                    if (empId) {
                        const branchRes = await axiosInstance.get(APIPath.SELECT_ONE_EMPLOYEE(empId));
                        // ตรวจสอบโครงสร้าง data ให้ดี (บางครั้งเป็น branchRes.data.data)
                        const branchData = branchRes?.data?.data
                        setBranch(branchData);
                    }
                }
            } catch (error) {
                console.error("Error fetching all data:", error);
            }
        };
        if (id) fetchAllData();
    }, [id]);


    // if (loading) return <div className="flex justify-center p-10 text-red-600">{t("loading")}...</div>;

    const totalPrice = (data?.labour_total || 0) + (data?.part_total || 0);
    const totalPoint = Number(data?.labour_point || 0) + Number(data?.part_point || 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Top Action */}
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => navigate("/user/workshop-fix")}
                    className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
                >
                    <FaArrowLeft size={12} /> {t("back")}
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white border border-red-600 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-red-600 text-white text-center">
                    <h2 className="text-lg font-normal tracking-wide">{t("title")}</h2>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Main Info Grid: Customer | Car | Appointment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-gray-100 pb-8">
                        {/* Customer Info */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                                {t("customer_info")}
                            </h3>
                            <div className="text-sm space-y-2 text-gray-700">
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-600 block md:mb-1">{t("customer_name")}:</span>
                                    <span className="text-gray-800">{data?.card?.user?.username || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("customer_phone")}:</span>
                                    <span className="text-gray-800">{data?.card?.user?.phoneNumber || "-"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Car Info */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                                {t("car_info")}
                            </h3>
                            <div className="text-sm space-y-2 text-gray-700">
                                <p className="flex justify-between md:block ">
                                    <span className="text-gray-400 block md:mb-1">{t("car_model")}:</span>
                                    <span className="truncate block text-gray-800">{data?.card?.car?.model || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("plate_number")}:</span>
                                    <span className="text-gray-800">{data?.card?.car?.plateNumber || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("engine_number")}:</span>
                                    <span className="text-gray-800">{data?.card?.car?.engineNumber || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("frame_number")}:</span>
                                    <span className="text-gray-800">{data?.card?.car?.frameNumber || "-"}</span>
                                </p>

                            </div>
                        </div>

                        {/* Appointment Info */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                                {t("appointment_time")}
                            </h3>
                            <div className="text-sm space-y-2 text-gray-700">
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("date_label")}:</span>
                                    <span className="text-gray-800">{formatDates(data?.createdAt)}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("branch_label")}:</span>
                                    <span className="text-gray-800">{branch?.branch?.branch_name || "-"}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services Table */}
                    <div className="mb-10">
                        <h3 className="text-sm text-gray-900 mb-4 flex items-center gap-2 font-normal">
                            <span className="w-1 h-4 bg-red-600"></span>
                            {t("service_information")}
                        </h3>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="p-3 w-12 text-center font-normal">#</th>
                                        <th className="p-3 font-normal">{t("service_label")}</th>
                                        <th className="p-3 font-normal">{t("remark_label")}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border border-red-600 p-5 rounded-xl bg-white">

                        <table className="w-full text-sm border-collapse">

                            <tbody className="text-gray-700">

                                {/* ================= PRICE ================= */}
                                <tr className="border-b border-gray-100">
                                    <td className="py-2">{t("fixCarPrice")}</td>
                                    <td className="py-2 w-24 text-left font-mono">
                                        {FormatNumber(data?.labour_total)} {t("kip")}
                                    </td>
                                </tr>

                                <tr className="border-b border-gray-100 ">
                                    <td className="py-2 ">{t("carPartPrice")}</td>
                                    <td className="py-2 w-24 text-left font-mono ">
                                        {FormatNumber(data?.part_total)} {t("kip")}
                                    </td>
                                </tr>

                                {/* spacer */}
                                <tr>
                                    <td colSpan={2} className="h-2"></td>
                                </tr>

                                {/* ================= POINT ================= */}
                                <tr>
                                    <td className="py-2">{t("labour_point-placholder")}</td>
                                    <td className="py-2 w-24 text-left font-mono">
                                        {Number(data?.labour_point || 0)
                                    } {t("point_text")}
                                    </td>
                                </tr>

                                <tr className="border-b border-gray-100">
                                    <td className="py-2">{t("part_point-placholder")}</td>
                                    <td className="py-2 w-24 text-left font-mono">
                                        {Number(data?.part_point || 0)} {t("point_text")}
                                    </td>
                                </tr>



                                {/* ================= TOTAL POINT ================= */}
                                <tr>
                                    <td className="pt-3 text-green-600 uppercase tracking-tight text-md font-medium">
                                        {t("totalPoint")}
                                    </td>
                                    <td className="pt-3 w-24 text-left">
                                        <span className="text-md text-green-600 font-mono font-semibold">
                                            {totalPoint}
                                        </span>
                                        <span className="ml-1 text-green-600 font-medium">
                                            {t("point_text")}
                                        </span>
                                    </td>
                                </tr>
                                {/* ================= TOTAL PRICE ================= */}
                                <tr>
                                    <td className="pt-3 text-green-600 uppercase tracking-tight text-lg font-medium">
                                        {t("totalPrice")}
                                    </td>
                                    <td className="pt-3 w-24 text-left">
                                        <span className="text-xl text-green-600 font-mono font-semibold">
                                            {FormatNumber(totalPrice)}
                                        </span>
                                        <span className="ml-1 text-green-600 font-medium">
                                            {t("kip")}
                                        </span>
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkShopFixDetail;