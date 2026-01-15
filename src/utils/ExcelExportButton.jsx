import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

const ExportExcelButton = ({ data, fileName = "ExportData.xlsx" }) => {
  const { t } =useTranslation("util")
  const handleExport = () => {
    if (!data || data.length === 0) {
      return;
    }

    // แปลง JSON เป็น worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // ตั้งค่า font ให้ทุก cell
    Object.keys(ws).forEach((key) => {
      if (key[0] === "!") return; // ข้าม key พิเศษ
      ws[key].s = {
        font: {
          name: "Noto Sans Lao",
          sz: 12, // ขนาดฟอนต์
          color: { rgb: "000000" }, // สีดำ
        },
      };
    });

    // สร้าง workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // เขียน workbook เป็นไฟล์ blob พร้อม style
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true, // ต้องเปิด cellStyles ด้วย
    });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // ดาวน์โหลดไฟล์
    saveAs(blob, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="border text-black px-2 mt-1 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg hover:bg-gray-100 text-xs sm:text-sm lg:text-base transition-colors cursor-pointer shadow-4xl w-full sm:w-auto min-w-[100px] sm:min-w-[120px] lg:min-w-auto"
    >
      <span className="whitespace-nowrap">{t("export")}</span>
    </button>
  );
};

export default ExportExcelButton;
