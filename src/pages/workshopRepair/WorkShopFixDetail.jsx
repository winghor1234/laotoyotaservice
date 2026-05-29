
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
    // const [booking, setBooking] = useState(null);
    // const [service, setService] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
                const fixData = fixRes?.data?.data;
                setData(fixData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAllData();
    }, [id]);

    if (loading) return <div className="flex justify-center p-10 text-red-600">{t("loading")}...</div>;

    const totalPrice = (data?.labour_total || 0) + (data?.part_total || 0);

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
                                    <span className="text-gray-400 block md:mb-1">{t("customer_name")}:</span>
                                    <span>{data?.card?.user?.username || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("customer_phone")}:</span>
                                    <span>{data?.card?.user?.phoneNumber || "-"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Car Info */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                                {t("car_info")}
                            </h3>
                            <div className="text-sm space-y-2 text-gray-700">
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("plate_number")}:</span>
                                    <span>{data?.card?.car?.plateNumber || "-"}</span>
                                </p>
                                <p className="flex justify-between md:block text-xs">
                                    <span className="text-gray-400 block md:mb-1">{t("car_model")}:</span>
                                    <span className="truncate block">{data?.card?.car?.model || "-"}</span>
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
                                    <span className="text-red-600">{formatDates(data?.createdAt)}</span>
                                </p>
                                <p className="flex justify-between md:block">
                                    <span className="text-gray-400 block md:mb-1">{t("branch_label")}:</span>
                                    <span>{data?.branch?.branch_name || "-"}</span>
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
                                {/* <tbody className="divide-y divide-gray-100 text-gray-700">
                                    {service.length > 0 ? (
                                        service.map((item, index) => (
                                            <tr key={index} className="hover:bg-red-50/20 transition-colors">
                                                <td className="p-3 text-center text-red-600">{index + 1}</td>
                                                <td className="p-3">{item?.service?.serviceName}</td>
                                                <td className="p-3 text-gray-500">{data?.remark || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={3} className="p-6 text-center text-gray-400">{t("no_service")}</td></tr>
                                    )}
                                </tbody> */}
                            </table>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border border-red-600 p-5 rounded-xl bg-white">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center text-gray-500 font-normal">
                                <span>{t("fixCarPrice")}</span>
                                <span className="font-mono text-gray-800">{FormatNumber(data?.labour_total)} ກີບ</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 border-b border-gray-100 pb-3 font-normal">
                                <span>{t("carPartPrice")}</span>
                                <span className="font-mono text-gray-800">{FormatNumber(data?.part_total)} ກີບ</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-red-600 uppercase tracking-tight font-normal">{t("totalPrice")}</span>
                                <div className="text-right">
                                    <span className="text-2xl text-red-600 font-mono font-normal">
                                        {FormatNumber(totalPrice)}
                                    </span>
                                    <span className="ml-1.5 text-red-600 font-normal">ກີບ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkShopFixDetail;