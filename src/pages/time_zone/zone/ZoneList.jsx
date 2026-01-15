import { useEffect, useState } from "react";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import { filterByDateRange } from "../../../utils/FilterDate";
import { filterSearch } from "../../../utils/FilterSearch";
import { Clock3, Edit, MapPinned, Trash } from "lucide-react";
import SelectDate from "../../../utils/SelectDate";
import AddZone from "./AddZone";
import EditZone from "./EditZone";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import ExportExcelButton from "../../../utils/ExcelExportButton";
import ImportExcel from "../../../utils/ImportExel";
import { useTranslation } from "react-i18next";

const ZoneList = () => {
    const { t } = useTranslation("timeZone");
    const [showEditZone, setShowEditZone] = useState(false);
    const [showAddZone, setShowAddZone] = useState(false);
    const [zone, setZone] = useState([]);
    const [zoneId, setZoneId] = useState(null);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportData, setExportData] = useState([]);
    const navigate = useNavigate();

    const fetchZone = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_ZONE);
            const data = res?.data?.data || [];
            setZone(data);
            setExportData(
                data.map((item) => ({
                    [t("zoneNameLabel")]: item.zoneName,
                    [t("timeFixLabel")]: item.timeFix,
                    [t("statusLabel")]: item.zoneStatus ? t("statusFree") : t("statusFull"),
                }))
            );
        } catch (error) {
            console.error("Error fetching zone:", error);
        }
    };

    useEffect(() => {
        fetchZone();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("zoneDeleteConfirm"),
            t("ZoneDeleteSuccess")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_ZONE(id));
            fetchZone();
        }
    };

    const filteredZone = filterByDateRange(
        filterSearch(zone, "zoneName", search),
        startDate,
        endDate,
        "createdAt"
    );

    return (
        <div className="p-4">
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("zoneSearchPlaceholder")}
                    onDateChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                />
                <ExportExcelButton data={exportData} fileName="ZoneData.xlsx" />
                <ImportExcel
                    apiPath={APIPath.CREATE_ZONE}
                    requiredFields={[t("zoneNameLabel"), t("timeFixLabel")]}
                    transformData={(item) => ({
                        zoneName: item[t("zoneNameLabel")],
                        timeFix: item[t("timeFixLabel")],
                        zoneStatus: true,
                    })}
                    onUploadSuccess={fetchZone}
                />
                <button
                    onClick={() => setShowAddZone(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base w-full sm:w-auto"
                >
                    {t("addButton")}
                </button>
            </div>

            {/* Zone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
                {filteredZone.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => (
                    <div key={item.zone_id} className="flex justify-center hover:shadow-xl transition-shadow">
                        {/* Zone Info */}
                        <div
                            onClick={() => navigate(`/user/zoneDetail/${item.zone_id}`)}
                            className={`${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"} text-white w-full flex flex-col gap-2 px-4 py-2 rounded-l cursor-pointer shadow-2xl`}
                        >
                            <div className="flex items-center justify-end gap-3 text-xl font-semibold">
                                <MapPinned />
                                {item.zoneName}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Clock3 className="w-4 h-4" />
                                {item.timeFix} {t("minuteLabel")}
                            </div>
                            <div className="mt-2 ml-5 flex justify-center font-semibold text-lg">
                                {item.zoneStatus ? t("statusFree") : t("statusFull")}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                            className={`flex flex-col items-center justify-start py-2 gap-2 ${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"} text-white px-2 rounded-r`}
                        >
                            <Edit
                                className="cursor-pointer w-5 h-5"
                                onClick={() => {
                                    setShowEditZone(true);
                                    setZoneId(item.zone_id);
                                }}
                            />
                            <Trash
                                className="cursor-pointer w-5 h-5"
                                onClick={() => handleDelete(item.zone_id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Popups */}
            <EditZone show={showEditZone} onClose={() => setShowEditZone(false)} zoneId={zoneId} fetchZone={fetchZone} />
            <AddZone show={showAddZone} onClose={() => setShowAddZone(false)} fetchZone={fetchZone} />
        </div>
    );
};

export default ZoneList;
