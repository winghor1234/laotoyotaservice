import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "./AxiosInstance";
import { SuccessAlert } from "./handleAlert/SuccessAlert";
import Spinner from "./Loading";
import { useTranslation } from "react-i18next";


/**
 * @param {Function} onUploadSuccess - callback หลัง import สำเร็จ
 * @param {Function} transformData - แปลงข้อมูลก่อนส่ง (optional)
 * @param {string} apiPath - endpoint สำหรับ POST
 * @param {string[]} requiredFields - ฟิลด์ที่ต้องมีใน Excel
 */
const ImportExcel = ({onUploadSuccess,transformData,apiPath,requiredFields = [],}) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("util");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const item of jsonData) {
        // ตรวจสอบ required fields
        for (const field of requiredFields) {
          if (!item[field]) throw new Error(`Missing field: ${field}`);
        }

        const payload = transformData ? transformData(item) : item;
        const formData = new URLSearchParams();
        for (const key in payload) {
          formData.append(key, payload[key]);
        }

        await axiosInstance.post(apiPath, formData);
      }

      SuccessAlert(t("import_success"), 1500, "success");
      onUploadSuccess?.();
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error importing Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer shadow w-full sm:w-auto min-w-[120px]"
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
      >
        {loading ? (
          <Spinner size="5" color="white" />
        ) : (
          <span className="whitespace-nowrap">{t("import")}</span>
        )}
      </button>
    </div>
  );
};

export default ImportExcel;
