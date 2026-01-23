import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

const ExportExcelButton = ({ data, fileName = "ExportData.xlsx" }) => {
  const { t } = useTranslation("util")
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

    <div className=" flex items-center gap-2">
      <button
        onClick={handleExport}
        className=" flex items-center bg-gray-600 hover:bg-gray-700 text-white rounded gap-2 px-3 "
      >
        <span className="whitespace-nowrap p-3 ">{t("export")}</span>
      </button>
    </div>
  );
};

export default ExportExcelButton;
