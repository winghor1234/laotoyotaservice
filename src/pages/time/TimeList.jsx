
import { useEffect, useState } from "react";
import { Calendar, TimerIcon, Edit, Trash, MapPinned, Search, Timer, ListFilterPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import SelectDate from "../../utils/SelectDate";
import ExportExcelPopup from "../../utils/exportExelPopup";
import AddTime from "./AddTime";
import EditTime from "./EditTime";
import DownloadButton from "../../utils/DownloadButton";

const TimeList = () => {
    const { t } = useTranslation("timeZone");

    const [showAddTime, setShowAddTime] = useState(false);
    const [showEditTime, setShowEditTime] = useState(false);
    const [timeId, setTimeId] = useState(null);
    // const [exportData, setExportData] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // ✅ ใช้ Server Pagination
    const {
        data: time,
        page,
        totalPage,
        search,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            return axiosInstance.get(APIPath.GET_ALL_TIME, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            });
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleToDetailTime = (id) => {
        navigate(`/user/time-detail/${id}`);
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus = !item.timeStatus;

            await axiosInstance.put(
                APIPath.UPDATE_TIME_STATUS(item.time_id),
                { timeStatus: String(newStatus) }
            );

            fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("timeDeleteConfirm"),
            t("timeDeleteSuccess")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_TIME(id));
            fetchData();
        }
    };

    return (
        <div>
            <div className=" gap-9 mb-6 flex justify-end items-center">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                    placeholder={t("timeSearchPlaceholder")}
                    apiPath={APIPath.GET_ALL_TIME}
                    fileName={"time-report.xlsx"}
                />
                {/* download button */}
                <DownloadButton open={open} setOpen={setOpen} />
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_TIME}
                        fileName="time-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                <button
                    onClick={() => setShowAddTime(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-white rounded font-medium"
                >
                    {t("addButton")}
                </button>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {time?.map((item) => (
                    <div key={item.time_id} className="flex hover:shadow-xl">
                        <div
                            onClick={() => handleToDetailTime(item.time_id)}
                            className={`${item.timeStatus
                                ?
                                "bg-green-600"
                                : "bg-[#E52020]"
                                } text-white cursor-pointer w-full px-4 py-3 rounded-l shadow`}
                        >
                            <div className="flex items-center gap-2">
                                <TimerIcon />
                                {item.time}
                            </div>

                            {/* <div className="mt-2 flex items-center gap-2">
                                <Calendar />
                                {item.date}
                            </div> */}

                            {/* <div className="mt-2 flex items-center gap-2 font-semibold">
                                <MapPinned />
                                {item?.zone?.zoneName}
                            </div> */}
                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <ListFilterPlus  />
                                {item?.qty}
                            </div>

                            <div className="my-2 font-semibold">
                                {item.timeStatus ? t("statusFree") : t("statusFull")}
                            </div>
                        </div>

                        <div className={`flex flex-col items-center w-24 gap-2 px-2 rounded-r ${item.timeStatus
                            ?
                            "bg-green-600"
                            : "bg-[#E52020]"
                            } text-white`}
                        >
                            <Edit
                                className="mt-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEditTime(true);
                                    setTimeId(item.time_id);
                                }}
                            />
                            <Trash
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.time_id);
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(item);
                                }}
                                className="mt-2 px-2 py-1 bg-white text-black rounded text-sm"
                            >
                                {item.timeStatus ? t("statusFree") : t("statusFull")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination (แก้ไขให้โชว์แค่บางช่วงหน้า) */}
            <div className="flex justify-end mt-4 gap-2 items-center">
                {/* ปุ่มย้อนกลับ */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    ‹
                </button>

                {getPageNumbers().map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* ปุ่มถัดไป */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPage || totalPage === 0}
                    className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    ›
                </button>
            </div>

            {/* Popups */}
            <EditTime
                show={showEditTime}
                onClose={() => setShowEditTime(false)}
                timeId={timeId}
                fetchTime={fetchData}
            />

            <AddTime
                show={showAddTime}
                onClose={() => setShowAddTime(false)}
                fetchTime={fetchData}
            />
        </div>
    );
};

export default TimeList;