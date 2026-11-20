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

    const [data, setData] = useState(null);
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




    const handleExportPDF = () => {
        const element = billRef.current;
        const filename = `Bill_${data?.card?.user?.username}_${data?.invoice_number}.pdf`;

        // Patch oklch in real DOM before capture
        const styleEls = document.querySelectorAll('style');
        const backups = [];
        styleEls.forEach((style) => {
            backups.push(style.textContent);
            style.textContent = style.textContent.replace(/oklch\([^)]*\)/g, 'unset');
        });

        // Disable external stylesheets temporarily
        const linkEls = document.querySelectorAll('link[rel="stylesheet"]');
        linkEls.forEach((link) => { link.disabled = true; });

        const opt = {
            margin: 0.5,
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(element).set(opt).save().finally(() => {
            // Restore original styles
            styleEls.forEach((style, i) => { style.textContent = backups[i]; });
            linkEls.forEach((link) => { link.disabled = false; });
        });
    };
    const totalPoint = Number(data?.labour_point || 0) + Number(data?.part_point || 0);



    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Action Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => navigate("/user/workshop-fix")}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                    >
                        <FaArrowLeft />
                        {t("back")}
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
                    >
                        <FaFileInvoiceDollar />
                        {t("exportPDF")}
                    </button>
                </div>

                {/* Invoice Card */}
                <div
                    ref={billRef}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    {/* Success Header */}
                    <div className="border-b border-slate-100 px-6 py-8 text-center sm:px-10">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                            <FaCheckCircle className="h-8 w-8 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            {t("billTitle")}
                        </h2>

                        <p className="mt-2 text-sm text-green-600 font-medium">
                            {t("complete_fix")}
                        </p>
                    </div>

                    <div className="space-y-8 p-6 sm:p-10">

                        {/* Invoice Information */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {t("branch_label")}
                                </p>
                                <p className="text-base font-semibold text-slate-800">
                                    {branch?.branch?.branch_name || "-"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm sm:text-right">
                                <div className="flex justify-between gap-4 sm:justify-end">
                                    <span className="text-slate-500">{t("date_bill")}</span>
                                    <span className="font-medium text-slate-800">
                                        {formatDates(data?.invoice_date)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 sm:justify-end">
                                    <span className="text-slate-500">{t("billId")}</span>
                                    <span className="font-semibold text-slate-800">
                                        {data?.invoice_number || "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 sm:justify-end">
                                    <span className="text-slate-500">{t("tax_invoice")}</span>
                                    <span className="font-medium text-slate-800">
                                        {data?.tax_invoice_code || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200" />

                        {/* Customer & Vehicle Information */}
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="h-5 w-1 rounded-full bg-green-500" />
                                <h3 className="text-base font-bold text-slate-800">
                                    {t("customerName")}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        label: t("customerName"),
                                        value: data?.card?.user?.username,
                                    },
                                    {
                                        label: t("phone"),
                                        value: data?.card?.user?.phoneNumber,
                                    },
                                    {
                                        label: t("plateNumber"),
                                        value: data?.card?.car?.plateNumber,
                                    },
                                    {
                                        label: t("carModel"),
                                        value: data?.card?.car?.model,
                                    },
                                    {
                                        label: t("zone_label"),
                                        value: data?.card?.car?.engineNumber,
                                    },
                                    {
                                        label: t("date_label"),
                                        value: formatDates(data?.createdAt),
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                                    >
                                        <p className="mb-1 text-xs font-medium text-slate-400">
                                            {item.label}
                                        </p>
                                        <p className="break-words text-sm font-semibold text-slate-800">
                                            {item.value || "-"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 sm:p-6">
                            {/* <h3 className="mb-5 text-base font-bold text-slate-800">
                                {t("totalPrice")}
                            </h3> */}

                            <div className="space-y-4">



                                {/* Total Price */}
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-semibold text-slate-700">
                                        {t("totalPrice")}
                                    </span>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold tracking-tight text-green-700 sm:text-3xl">
                                            {FormatNumber(
                                                Number(data?.labour_total || 0) +
                                                Number(data?.part_total || 0)
                                            )}
                                             {" "}{t("kip")}
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-dashed border-green-200" />


                                {/* Total Point */}
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-slate-600">
                                        {t("totalPoint")}
                                    </span>

                                    <span className="text-lg font-bold text-green-700">
                                        {FormatNumber(totalPoint)} {t("point_text")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thank You */}
                        <div className="border-t border-slate-100 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                {t("thanks_message")} 🙏
                            </p>
                        </div>

                        {/* Complete Button */}
                        <div className="flex justify-center sm:justify-end">
                            <button
                                onClick={() => navigate("/user/workshop-fix")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95 sm:w-auto"
                            >
                                <FaCheckCircle />
                                {t("complete_fix")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

// const btnGreen = {
//     background: "#16a34a",
//     color: "#fff",
//     padding: "8px 16px",
//     borderRadius: "8px",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     cursor: "pointer",
// };

export default FixBillDetail;
