import { FaArrowLeft, FaFileInvoiceDollar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import html2pdf from "html2pdf.js";
import { useTranslation } from "react-i18next";
import { generateBillId } from "../../../utils/BillGenerate";
import logo from "../../../assets/logo.jpg";

const BookingSuccess = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const printRef = useRef();
    const { t } = useTranslation("booking");
    const [billId, setBillId] = useState("");
    const [bookingDetail, setBookingDetail] = useState([]);
    useEffect(() => {
        const init = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
                const bookingData = res?.data?.data || null;
                setBooking(bookingData);

                const bookingDetailRes = await axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(id));
                setBookingDetail(bookingDetailRes?.data?.data || []);

                // Generate Bill ID
                const storedBillId = localStorage.getItem(`billId-${id}`);
                if (storedBillId) {
                    setBillId(storedBillId);
                } else {
                    const newBillId = generateBillId();
                    localStorage.setItem(`billId-${id}`, newBillId);
                    setBillId(newBillId);
                }

            } catch (error) {
                console.log(error);
            }
        };

        init();
    }, [id]);

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

    // if (!booking) return null;

    return (
        <div style={{ background: "#f3f4f6", padding: "40px 0" }}>
            {/* Top Action Buttons (not in PDF) */}
            <div style={{ maxWidth: "850px", margin: "0 auto 20px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => navigate("/user/booking")} style={btnGray}>
                    <FaArrowLeft /> {t("back")}
                </button>
                <button onClick={handleExportPDF} style={btnGreen}>
                    <FaFileInvoiceDollar /> {t("export_pdf")}
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
                {/* HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* LEFT: Logo + Shop */}
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <img src={logo} alt="logo" style={{ width: "90px" }} />
                        <div>
                            <h2 style={{ margin: 0 }}>{t("company_name")}</h2>
                        </div>
                    </div>

                    {/* RIGHT: Invoice Info */}
                    <div style={{ textAlign: "right" }}>
                        {/* <h2 style={{ margin: 0 }}>{t("bill")}</h2> */}
                        <p><strong>{t("billId")}:</strong> {billId}</p>
                        <p><strong>{t("date_bill")}:</strong> {booking?.time?.date}</p>
                        <p><strong>{t("time_label")}:</strong> {booking?.time?.time}</p>
                    </div>
                </div>

                <hr style={{ margin: "30px 0" }} />

                {/* CUSTOMER + VEHICLE SECTION */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                    <div style={{ width: "48%" }}>
                        <h3 style={{ marginBottom: "10px" }}>{t("customerInfo")}</h3>
                        <p><strong>{t("name")}:</strong> {booking?.user?.username}</p>
                        <p><strong>{t("phone")}:</strong> {booking?.user?.phoneNumber}</p>
                    </div>

                    <div style={{ width: "48%" }}>
                        <h3 style={{ marginBottom: "10px" }}>{t("fixDetail")}</h3>
                        <p><strong>{t("plate_number")}:</strong> {booking?.car?.plateNumber}</p>
                        <p><strong>{t("car_model")}:</strong> {booking?.car?.model}</p>
                    </div>
                </div>

                {/* SERVICE TABLE */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
                    <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                            <th style={th}>#</th>
                            <th style={th}>{t("service_name")}</th>
                            <th style={th}>{t("remark")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingDetail?.map((item, index) =>
                        (
                            <tr key={index}>
                                <td style={td}>{index + 1}</td>
                                <td style={td}>{item.serviceName}</td>
                                <td style={td}>{booking?.remark || "-"}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>

                <hr />

                {/* FOOTER */}
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "10pt",
                        color: "#6b7280",
                        marginTop: "20px",
                    }}
                >
                    {t("thanks_message")}
                </p>
            </div>
            {/* Action Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate("/user/booking")}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full transition-colors font-medium text-sm lg:text-base w-full sm:w-auto"
                >
                    {t("complete_fix")}
                </button>
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
