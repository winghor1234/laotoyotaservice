import { FaArrowLeft, FaCheckCircle, FaFileInvoiceDollar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import html2pdf from "html2pdf.js";
import { formatDates } from "../../utils/FormatDate";
import { FormatNumber } from "../../utils/FormatNumber";



const FixBillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("booking");
    const billRef = useRef();

    // เปลี่ยนค่าเริ่มต้นจาก {} เป็น null หรือ "" เพื่อป้องกัน bug
    const [data, setData] = useState(null);
    // const [employeeId, setEmployeeId] = useState("");
    const [branch, setBranch] = useState(null);

    const fetchData = async () => {
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
                    const branchData = branchRes?.data?.data || branchRes?.data;
                    setBranch(branchData);
                }
            }
        } catch (error) {
            console.error("Error fetching all data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    console.log(data);



    const handleExportPDF = () => {
        const element = billRef.current;
        const filename = `Bill_${data?.card?.user?.username}_${data?.invoice_number}.pdf`;
        const opt = {
            margin: 0.5,
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(opt).save();
    };
    const totalPoint = Number(data?.labour_point || 0) + Number(data?.part_point || 0);


    return (
        <div
            className=" relative h-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto rounded-2xl shadow-md"
            style={{ backgroundColor: "#f9fafb" }}
        >
            {/* ปุ่มย้อนกลับ */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate('/user/workshop-fix')}
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
                    style={{ backgroundColor: "#16a34a" }}
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
                <div className="flex justify-center mb-2">
                    {/* <img src={logo} alt="logo" style={{ width: "80px" }} /> */}
                    <FaCheckCircle className="text-green-500 h-7 w-7 shrink-0" />
                </div>

                <h2 className="text-center text-2xl font-semibold mb-4">
                    {t("billTitle")}
                </h2>


                <div className="mb-4 text-sm flex justify-between items-start" style={{ color: "#4b5563" }}>
                    <div>
                        {/* <div><strong>{t("branch_label")}</strong>: {data?.branch?.branch_name}</div> */}
                        <div><strong>{t("branch_label")}</strong>: {branch?.branch?.branch_name}</div>
                    </div>
                    <div>
                        <p>{t("date_bill")}: {formatDates(data?.invoice_date)}</p>
                        <p>{t("billId")}: {data?.invoice_number}</p>
                        <p>{t("tax_invoice")}: {data?.tax_invoice_code}</p>

                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm" style={{ color: "#374151" }}>
                    <div><strong>{t("customerName")}</strong>: {data?.card?.user?.username}</div>
                    <div><strong>{t("phone")}</strong>: {data?.card?.user?.phoneNumber}</div>
                    <div><strong>{t("plateNumber")}</strong>: {data?.card?.car?.plateNumber}</div>
                    <div><strong>{t("carModel")}</strong>: {data?.card?.car?.model}</div>
                    <div><strong>{t("zone_label")}</strong>: {data?.card?.car?.engineNumber}</div>
                    {/* <div><strong>{t("zone_label")}</strong>: kkkk</div> */}
                    <div><strong>{t("date_label")}</strong>: {formatDates(data?.createdAt)}</div>
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
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>
                                    {t("fixCarPrice")}
                                </td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>
                                    {data?.labour_total?.toLocaleString()}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>2</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>
                                    {t("carPartPrice")}
                                </td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>
                                    {data?.part_total?.toLocaleString()}
                                </td>
                            </tr>

                            {/* 🔥 LABOUR POINT */}
                            <tr>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>3</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>
                                    {t("labour_point-placholder")}
                                </td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>
                                    {Number(data?.labour_point || 0).toFixed(2)}
                                </td>
                            </tr>

                            {/* 🔥 PART POINT */}
                            <tr>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>4</td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>
                                    {t("part_point-placholder")}
                                </td>
                                <td style={{ border: "1px solid #d1d5db", padding: "0.5rem", textAlign: "right" }}>
                                    {Number(data?.part_point || 0).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* total point */}
                <div className="mt-4 flex justify-end ">
                    <div className=" w-2/7 " >
                        <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#15803d" }}>
                            {t("totalPoint")}: {totalPoint.toFixed(2)} {t("point_text")}
                        </h3>
                    </div>
                </div>
                {/* total price */}
                <div className="mt-4 flex justify-end">
                    <div className="w-2/7" >
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#15803d" }}>
                            {t("totalPrice")}: {FormatNumber(data?.labour_total + data?.part_total)} {t("kip")}
                        </h3>
                    </div>
                </div>

                <p className="text-center text-sm mt-6" style={{ color: "#6b7280" }}>
                    {t("thanks_message")} 🙏
                </p>
                {/* Action Button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => navigate("/user/workshop-fix")}
                        style={btnGreen}
                    >
                        {t("complete_fix")}
                    </button>
                </div>
            </div>
        </div>
    );
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

export default FixBillDetail;
