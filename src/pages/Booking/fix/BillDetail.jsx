import { FaArrowLeft, FaFileInvoiceDollar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import html2pdf from "html2pdf.js";

const BillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("booking");
    const billRef = useRef();

    const [data, setData] = useState([]);
    const [booking, setBooking] = useState([]);
    const [zone, setZone] = useState([]);

    useEffect(() => {
        const fetchBillData = async () => {
            try {
                const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
                const fixData = fixRes?.data?.data;
                setData(fixData);

                const bookingId = fixData?.bookingId;
                const zoneId = fixData?.zoneId;

                if (bookingId || zoneId) {
                    const [bookingRes, zoneRes] = await Promise.all([
                        bookingId ? axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId)) : Promise.resolve(null),
                        zoneId ? axiosInstance.get(APIPath.SELECT_ONE_ZONE(zoneId)) : Promise.resolve(null),
                    ]);
                    if (bookingRes) setBooking(bookingRes?.data?.data);
                    if (zoneRes) setZone(zoneRes?.data?.data);
                }
            } catch (error) {
                console.error("Error fetching bill data:", error);
            }
        };
        fetchBillData();
    }, [id]);

    // ฟังก์ชัน Export PDF
    const handleExportPDF = () => {
        const element = billRef.current;
        const opt = {
            margin: 0.5,
            filename: `Bill_${booking?.user?.username || "Customer"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <div
            className=" relative h-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto rounded-2xl shadow-md"
            style={{ backgroundColor: "#f9fafb" }}
        >
            {/* ปุ่มย้อนกลับ */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate('/user/booking')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 transition-colors"
                    style={{ backgroundColor: "#e5e7eb" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                >
                    <FaArrowLeft />
                    {t("back")}
                </button>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-xl transition-colors"
                    style={{ backgroundColor: "#16a34a" }} // แทน bg-green-600
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                >
                    <FaFileInvoiceDollar />
                    {t("exportPDF")}
                </button>
            </div>

            <hr className="border-gray-300 border mb-4" />

            {/* เนื้อหาบิล */}
            <div ref={billRef} className="p-6 rounded-xl" style={{ backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                <h2 className="text-center text-2xl font-semibold mb-4" style={{ color: "#374151" }}>
                    🧾 {t("billTitle")}
                </h2>

                <div className="mb-4 text-sm" style={{ color: "#4b5563" }}>
                    <p>{t("date_bill")}: {new Date().toLocaleDateString("lo-LA")}</p>
                    <p>{t("billId")}: {data?.id}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm" style={{ color: "#374151" }}>
                    <div><strong>{t("customerName")}</strong>: {booking?.user?.username}</div>
                    <div><strong>{t("phone")}</strong>: {booking?.user?.phoneNumber}</div>
                    <div><strong>{t("plateNumber")}</strong>: {booking?.car?.plateNumber}</div>
                    <div><strong>{t("carModel")}</strong>: {booking?.car?.model}</div>
                    <div><strong>{t("zone")}</strong>: {zone?.zoneName}</div>
                    <div><strong>{t("date_label")}</strong>: {booking?.time?.date}</div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2" style={{ color: "#374151" }}>{t("fixDetail")}</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db", fontSize: "0.875rem" }}>
                        <thead style={{ backgroundColor: "#f3f4f6" }}>
                            <tr>
                                <th style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "left" }}>{t("ID")}</th>
                                <th style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "left" }}>{t("list_bill")}</th>
                                <th style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>{t("price")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>1</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{t("fixCarPrice")}</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>{data?.fixCarPrice?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>2</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{t("carPartPrice")}</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>{data?.carPartPrice?.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <div style={{ textAlign: "right" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#15803d" }}>
                            {t("totalPrice")}: {data?.totalPrice?.toLocaleString()} ກີບ
                        </h3>
                    </div>
                </div>

                <p className="text-center text-sm mt-6" style={{ color: "#6b7280" }}>
                    {t("thanks_message")} 🙏
                </p>
            </div>
        </div>
    );
};

export default BillDetail;
