import { useEffect, useState } from "react";
import { Clock3, Edit, MapPinned, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import { filterByDateRange } from "../../../utils/FilterDate";
import { filterSearch } from "../../../utils/FilterSearch";
import SelectDate from "../../../utils/SelectDate";
import ExportExcelButton from "../../../utils/ExcelExportButton";
import ImportExcel from "../../../utils/ImportExel";

import AddZone from "./AddZone";
import EditZone from "./EditZone";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";

const ZoneList = () => {
    const { t } = useTranslation("timeZone");
    const navigate = useNavigate();

    const [zone, setZone] = useState([]);
    const [zoneId, setZoneId] = useState(null);
    const [showAddZone, setShowAddZone] = useState(false);
    const [showEditZone, setShowEditZone] = useState(false);

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportData, setExportData] = useState([]);

    const fetchZone = async () => {
        const res = await axiosInstance.get(APIPath.SELECT_ALL_ZONE);
        const data = res?.data?.data || [];
        setZone(data);

        setExportData(
            data.map((item) => ({
                [t("zoneNameLabel")]: item.zoneName,
                [t("timeFixLabel")]: item.timeFix,
                [t("statusLabel")]: item.zoneStatus
                    ? t("statusFree")
                    : t("statusFull"),
            }))
        );
    };

    useEffect(() => {
        fetchZone();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await DeleteAlert(
            t("zoneDeleteConfirm"),
            t("ZoneDeleteSuccess")
        );
        if (confirm) {
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
        <div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 lg:p-6">

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
                    className="bg-blue-600 hover:bg-blue-700 transition-colors  w-full sm:w-auto px-10 py-2 sm:py-3  text-white rounded-xl font-medium text-sm sm:text-base"
                >
                    {t("addButton")}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6">

                {filteredZone
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item) => (
                        <div key={item.zone_id} className="flex justify-center hover:shadow-xl">
                            {/* Card */}
                            <div
                                onClick={() =>
                                    navigate(`/user/zoneDetail/${item.zone_id}`)
                                }
                                className={`${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"}  text-white cursor-pointer w-full px-3 sm:px-4 py-2 sm:py-3  rounded-l shadow-2xl`}
                            >
                                <div className="ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3  text-base sm:text-lg font-semibold">
                                    <MapPinned />
                                    {item.zoneName}
                                </div>

                                <div className="mt-2 ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3  text-sm sm:text-md">
                                    <Clock3 className="w-4 h-4" />
                                    {item.timeFix} {t("minuteLabel")}
                                </div>

                                <div className="mt-2 ml-2 sm:ml-4 font-semibold">
                                    <p className="text-base sm:text-lg lg:text-xl">
                                        {item.zoneStatus ? t("statusFree") : t("statusFull")}
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <div
                                className={`flex flex-col items-center justify-start py-2 gap-2 px-2 sm:px-3 rounded-r cursor-pointer  ${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"} text-white`}
                            >
                                <Edit
                                    className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                                    onClick={() => {
                                        setShowEditZone(true);
                                        setZoneId(item.zone_id);
                                    }}
                                />
                                <Trash
                                    className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                                    onClick={() => handleDelete(item.zone_id)}
                                />
                            </div>
                        </div>
                    ))}
            </div>

            <EditZone
                show={showEditZone}
                onClose={() => setShowEditZone(false)}
                zoneId={zoneId}
                fetchZone={fetchZone}
            />

            <AddZone
                show={showAddZone}
                onClose={() => setShowAddZone(false)}
                fetchZone={fetchZone}
            />
        </div>
    );
};

export default ZoneList;
