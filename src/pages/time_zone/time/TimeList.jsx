import { useEffect, useState } from "react";
import { filterByDateRange } from "../../../utils/FilterDate";
import { filterSearch } from "../../../utils/FilterSearch";
import { Calendar, TimerIcon, Edit, Trash, MapPinned } from "lucide-react";
import SelectDate from "../../../utils/SelectDate";
import AddTime from "./AddTime";
import EditTime from "./EditTime";
import { useNavigate } from "react-router-dom";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import ExportExcelButton from "../../../utils/ExcelExportButton";
import ImportExcel from "../../../utils/ImportExel";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const TimeList = () => {
    const { t } = useTranslation("timeZone"); // ใช้ namespace timeList
    const [showAddTime, setShowAddTime] = useState(false);
    const [showEditTime, setShowEditTime] = useState(false);
    const [time, setTime] = useState([]);
    const [timeId, setTimeId] = useState(null);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportData, setExportData] = useState([]);
    const navigate = useNavigate();

    const fetchTime = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_TIME);
            // const res = await axiosInstance.get(APIPath.SELECT_TIME_BY_BRANCH(1)); // ตัวอย่างการใช้ branchId = 1
            const data = res?.data?.data || [];
            setTime(data);
            // อัปเดต exportData ทุกครั้งเมื่อ fetch
            setExportData(
                data.map((item) => ({
                    ເວລາ: item.time,
                    ວັນທີເດືອນປີ: item.date,
                    ຊື່ໂຊນ: item?.zone?.zoneName,
                    ສະຖານະ: item.timeStatus ? "ຫວ່າງ" : "ເຕັມ",
                }))
            );
        } catch (error) {
            console.error("Error fetching time:", error);
        }
    };

    const handleToDetailTime = (id) => {
        navigate(`/user/time-detail/${id}`);
    };

    useEffect(() => {
        fetchTime();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("timeDeleteConfirm"),
            t("timeDeleteSuccess")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_TIME(id));
            fetchTime();
        }
    };

    const filteredTime = filterByDateRange(
        filterSearch(time, "name", search),
        startDate,
        endDate,
        "createdAt"
    );

    return (
        <div>
            {/* Top Controls */}
            <div className=" flex flex-col sm:flex-row md:flex-row lg:flex-row justify-center items-center gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("timeSearchPlaceholder")}
                    onDateChange={({ startDate, endDate }) => { setStartDate(startDate); setEndDate(endDate); }}
                />
                {/* Export Excel */}
                <ExportExcelButton data={exportData} fileName="TimeData.xlsx" />
                {/* Import Excel */}
                <ImportExcel
                    apiPath={APIPath.CREATE_TIME}
                    requiredFields={["ເວລາ", "ວັນທີເດືອນປີ"]}
                    transformData={(item) => ({
                        time: item["ເວລາ"],
                        date: item["ວັນທີເດືອນປີ"],
                    })}
                    onUploadSuccess={fetchTime}
                />
                <div onClick={() => setShowAddTime(true)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-10 py-2 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base">
                        {t("addButton")}
                    </button>
                </div>
            </div>
            {/* Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 
                overflow-y-auto gap-2 sm:gap-3 lg:gap-4 mb-6">
                {filteredTime
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item) => (
                        <div
                            key={item.time_id}
                            className="flex justify-center hover:shadow-xl"
                        >
                            <div
                                onClick={() => handleToDetailTime(item.time_id)}
                                className={`${item.timeStatus
                                    ? item.zoneId === null
                                        ? "bg-yellow-500"
                                        : "bg-green-600"
                                    : "bg-[#E52020]"
                                    } text-white cursor-pointer w-full px-3 sm:px-4 py-2 sm:py-3 rounded-l shadow-2xl`}
                            >
                                <div className="ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-md">
                                    <TimerIcon />
                                    {item.time}
                                </div>

                                <div className="mt-2 ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-md">
                                    <Calendar />
                                    {item.date}
                                </div>

                                <div className="mt-2 ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3  text-base sm:text-lg lg:text-xl font-semibold">
                                    <MapPinned />
                                    {item?.zone?.zoneName}
                                </div>

                                <div className="mt-2 ml-2 sm:ml-4 font-semibold">
                                    <p className="text-base sm:text-lg lg:text-xl">
                                        {item.timeStatus ? t("statusFree") : t("statusFull")}
                                    </p>
                                </div>
                            </div>

                            <div className={`flex flex-col items-center justify-start py-2 gap-2 px-2 sm:px-3 rounded-r cursor-pointer ${item.timeStatus
                                ? item.zoneId === null
                                    ? "bg-yellow-500"
                                    : "bg-green-600"
                                : "bg-[#E52020]"
                                } text-white`}
                            >
                                <Edit
                                    className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer tex-white hover:text-gray-400"
                                    onClick={() => {
                                        setShowEditTime(true);
                                        setTimeId(item.time_id);
                                    }}
                                />
                                <Trash
                                    className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer tex-white hover:text-gray-400"
                                    onClick={() => handleDelete(item.time_id)}
                                />
                            </div>
                        </div>
                    ))}
            </div>

            {/* Popups */}
            <EditTime show={showEditTime} onClose={() => setShowEditTime(false)} timeId={timeId} fetchTime={fetchTime} />
            <AddTime show={showAddTime} onClose={() => setShowAddTime(false)} fetchTime={fetchTime} addToExport={(newData) => setExportData((prev) => [...prev, { ...newData, status: t("statusFree") }])} />
        </div>
    );
};

export default TimeList;
