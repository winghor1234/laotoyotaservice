import { useState } from "react";
import { exportExcel } from "./exportExel";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, ChevronDown } from "lucide-react";

const presets = [
    { value: "today", label: "ມື້ນີ້" },
    { value: "yesterday", label: "ມື້ວານ" },
    { value: "thisMonth", label: "ເດືອນນີ້" },
    { value: "lastMonth", label: "ເດືອນກ່ອນ" },
    { value: "thisYear", label: "ປີນີ້" },
    { value: "lastYear", label: "ປີກ່ອນ" },
];

const ExportExcelPopup = ({ apiUrl, fileName = "export.xlsx", onClose }) => {
    const [selectedType, setSelectedType] = useState("preset"); // ค่าเริ่มต้นเป็น preset
    const [preset, setPreset] = useState(""); // สำหรับเก็บ preset ที่เลือก
    const [customStart, setCustomStart] = useState(""); // start date custom
    const [customEnd, setCustomEnd] = useState(""); // end date custom
    const { t } = useTranslation("booking");




    const getDateRange = () => {
        const now = new Date();
        let startDate, endDate;

        switch (preset) {
            case "today":
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
                break;

            case "yesterday": {
                const y = new Date(now);
                y.setDate(y.getDate() - 1);
                startDate = new Date(y.setHours(0, 0, 0, 0));
                endDate = new Date(y.setHours(23, 59, 59, 999));
                break;
            }

            case "thisMonth":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;

            case "lastMonth":
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                break;

            case "thisYear":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;

            case "lastYear":
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
                break;

            default:
                // custom
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
        }

        return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
    };

    const handleExport = async () => {
        if (!preset && (!customStart || !customEnd)) {
            alert("Please select a preset or custom date range");
            return;
        }

        const { startDate, endDate } = getDateRange();
        await exportExcel({ apiUrl, startDate, endDate, fileName });
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">{t("export")}</h2>
                {/* Preset Date */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 mb-2">
                        <input
                            type="radio"
                            name="dateType"
                            value="preset"
                            checked={selectedType === "preset"}
                            onChange={() => setSelectedType("preset")}
                        />
                        {t("choose_date")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {presets.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                disabled={selectedType !== "preset"} // disable ถ้าไม่เลือก preset
                                onClick={() => {
                                    setPreset(p.value);
                                    setCustomStart("");
                                    setCustomEnd("");
                                }}
                                className={`p-2 rounded border text-center cursor-pointer ${preset === p.value ? "bg-red-600 text-white" : "bg-white text-black border-gray-300"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Date */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 mb-2">
                        <input
                            type="radio"
                            name="dateType"
                            value="custom"
                            checked={selectedType === "custom"}
                            onChange={() => setSelectedType("custom")}
                        />
                        {t("custom_date")}
                    </label>

                    <div className="flex-1 relative mb-2">
                        <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <DatePicker
                            selected={customStart}
                            onChange={(date) => setCustomStart(date)}
                            disabled={selectedType !== "custom"}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_start_placeholder")}
                            className="w-full pl-8 pr-8 text-sm sm:text-base border border-gray-400 rounded bg-transparent outline-none cursor-pointer"
                        />
                    </div>

                    <div className="flex-1 relative">
                        <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <DatePicker
                            selected={customEnd}
                            onChange={(date) => setCustomEnd(date)}
                            disabled={selectedType !== "custom"}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_end_placeholder")}
                            className="w-full pl-8 pr-8 text-sm sm:text-base border border-gray-400 rounded bg-transparent outline-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border">{t("cancel")}</button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded bg-red-600 text-white"
                    >
                        {t("export")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportExcelPopup;