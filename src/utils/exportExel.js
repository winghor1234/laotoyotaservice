import { saveAs } from "file-saver";
import axiosInstance from "./AxiosInstance";

export const exportExcel = async ({ apiUrl, startDate, endDate, fileName }) => {
    try {
        const res = await axiosInstance.get(apiUrl, {
            responseType: "blob",
            params: { startDate, endDate },
        });

        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, fileName);
    } catch (error) {
        console.error("Export failed", error);
    }
};