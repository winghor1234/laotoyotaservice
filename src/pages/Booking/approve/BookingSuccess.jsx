import { FaArrowLeft, FaFileInvoiceDollar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import html2pdf from "html2pdf.js";
import { useTranslation } from "react-i18next";
import { generateBillId } from "../../../utils/BillGenerate";

const BookingSuccess = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const printRef = useRef();
    const { t } = useTranslation("booking");
    const [billId, setBillId] = useState("");
    const handleBack = () => navigate("/user/booking");

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
            setBooking(res?.data?.data || null);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        const storedBillId = localStorage.getItem(`billId-${id}`);

        if (storedBillId) {
            setBillId(storedBillId);
        } else {
            const newBillId = generateBillId();
            localStorage.setItem(`billId-${id}`, newBillId);
            setBillId(newBillId);
        }
    }, [id]);

    // Auto Export after render
    useEffect(() => {
        if (booking) {
            const timer = setTimeout(() => {
                handleExportPDF();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [booking]);

    const handleExportPDF = () => {
        if (!printRef.current) return;

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `Invoice_${booking?.invoiceNumber || id}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(printRef.current).save();
    };

    if (!booking) return null;

    return (
        <div style={{ background: "#f3f4f6", padding: "40px 0" }}>
            {/* Top Action Buttons (not in PDF) */}
            <div style={{ maxWidth: "850px", margin: "0 auto 20px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={handleBack} style={btnGray}>
                    <FaArrowLeft /> {t("back")}
                </button>
                <button onClick={handleExportPDF} style={btnGreen}>
                    <FaFileInvoiceDollar /> Export PDF
                </button>
            </div>

            {/* Invoice Paper */}
            <div
                ref={printRef}
                style={{
                    maxWidth: "850px",
                    margin: "auto",
                    background: "#ffffff",
                    padding: "40px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12pt",
                    lineHeight: "1.6",
                    color: "#111827",
                }}
            >
                {/* Invoice Header */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "larger", fontWeight: "bold" }}>{t("bill")}</h2>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p><strong>{t("billId")}:</strong>{billId}</p>
                        <p><strong>{t("date_bill")}:</strong> {booking?.time?.date}</p>
                        <p><strong>{t("time_label")}:</strong> {booking?.time?.time}</p>
                    </div>
                </div>

                <hr />

                {/* Customer Section */}
                <div style={{ marginTop: "25px", marginBottom: "25px" }}>
                    <h3 style={{ marginBottom: "10px" }}>Customer Information</h3>
                    <p><strong>{t("name")}</strong> {booking?.user?.username}</p>
                    <p><strong>{t("phone")}</strong> {booking?.user?.phoneNumber}</p>
                </div>

                {/* Vehicle Section */}
                <div style={{ marginBottom: "25px" }}>
                    <h3 style={{ marginBottom: "10px" }}>{t("fixDetail")}</h3>
                    <p><strong>{t("plate_number")}:</strong> {booking?.car?.plateNumber}</p>
                    <p><strong>{t("car_model")}:</strong> {booking?.car?.model}</p>
                </div>

                {/* Service Detail */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
                    <thead>
                        <tr style={{ background: "#f9fafb" }}>
                            <th style={th}>#</th>
                            <th style={th}>{t("remark")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>1</td>
                            <td style={td}>{booking?.remark || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                {/* Footer */}
                <p style={{ textAlign: "center", fontSize: "10pt", color: "#6b7280", marginTop: "20px" }}>
                    {t("thanks_message")}
                </p>
            </div>
        </div>
    );
};

const btnGray = {
    background: "#e5e7eb",
    padding: "8px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
};

const btnGreen = {
    background: "#16a34a",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
};

const th = {
    border: "1px solid #d1d5db",
    padding: "10px",
    textAlign: "left",
};

const td = {
    border: "1px solid #d1d5db",
    padding: "10px",
};

export default BookingSuccess;
