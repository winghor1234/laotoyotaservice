

import { FaArrowLeft, FaFileInvoiceDollar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import html2pdf from "html2pdf.js";

const BookingSuccess = () => {
    const { t } = useTranslation("booking");
    const navigate = useNavigate();
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const printRef = useRef();

    const handleBack = () => navigate("/user/booking");

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
            setBooking(res?.data?.data || {});
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExportPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: 0.5,
            filename: `Invoice_${booking?.invoiceNumber || "Booking"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <div
            className="relative max-w-4xl mx-auto rounded-2xl shadow-md p-6"
            style={{ backgroundColor: "#f9fafb" }}
        >
            {/* ปุ่มย้อนกลับ + Export PDF */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleBack}
                    style={{ backgroundColor: "#e5e7eb", padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", color: "#374151" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                >
                    <FaArrowLeft />
                    {t("back_button")}
                </button>
                <button
                    onClick={handleExportPDF}
                    style={{ backgroundColor: "#16a34a", padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", color: "#ffffff" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                >
                    <FaFileInvoiceDollar />
                    {t("exportPDF")}
                </button>
            </div>

            <hr style={{ border: "1px solid #d1d5db", marginBottom: "16px" }} />

            {/* เนื้อหา Booking */}
            <div
                ref={printRef}
                style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
            >
                <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: 600, color: "#16a34a", marginBottom: "16px" }}>
                    🔧 {t("booking_success") || "Booking Success"}
                </h2>

                <div style={{ marginBottom: "16px", color: "#4b5563", textAlign: "center" }}>
                    <p>{t("invoice_number")}: {booking?.invoiceNumber || "125532525"}</p>
                    <p>{t("points_earned", { points: 50 })}</p>
                </div>

                {/* Car & Time Info */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", color: "#374151", marginBottom: "16px" }}>
                    <div><strong>{t("customerName")}</strong>: {booking?.user?.username}</div>
                    <div><strong>{t("phone")}</strong>: {booking?.user?.phoneNumber}</div>
                    <div><strong>{t("plateNumber")}</strong>: {booking?.car?.plateNumber}</div>
                    <div><strong>{t("carModel")}</strong>: {booking?.car?.model}</div>
                    <div><strong>{t("date_label")}</strong>: {booking?.time?.date}</div>
                    <div><strong>{t("time_label")}</strong>: {booking?.time?.time}</div>
                </div>

                {/* Initial Symptoms */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                    <h3 style={{ fontWeight: 600, marginBottom: "8px", color: "#374151" }}>{t("initial_symptoms")}</h3>
                    <p style={{ color: "#374151", lineHeight: 1.5 }}>
                        {booking?.remark}
                    </p>
                </div>

                <p style={{ textAlign: "center", color: "#6b7280", marginTop: "16px" }}>
                    {t("thanks_message")} 🙏
                </p>
            </div>
        </div>
    );
};

export default BookingSuccess;
