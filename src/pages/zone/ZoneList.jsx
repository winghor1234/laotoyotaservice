import { useState, useEffect } from "react";
import { Clock3, Edit, MapPinned, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import ExportExcelButton from "../../utils/ExcelExportButton";
import ImportExcel from "../../utils/ImportExel";
import AddZone from "./AddZone";
import EditZone from "./EditZone";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../utils/exportExelPopup";
import SelectDate from "../../utils/SelectDate";
import DownloadButton from "../../utils/DownloadButton";

const ZoneList = () => {
    const { t } = useTranslation("timeZone");
    const navigate = useNavigate();

    const [zoneId, setZoneId] = useState(null);
    const [showAddZone, setShowAddZone] = useState(false);
    const [showEditZone, setShowEditZone] = useState(false);
    const [open, setOpen] = useState(false);


    // ✅ ใช้ Server Pagination
    const {
        data: zone,
        page,
        totalPage,
        search,
        handleSearch,
        handlePageChange,
        handleDateChange,
        fetchData,
        getPageNumbers,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search }) => {
            return axiosInstance.get(APIPath.GET_ALL_ZONE, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                },
            });
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await DeleteAlert(
            t("zoneDeleteConfirm"),
            t("ZoneDeleteSuccess")
        );
        if (confirm) {
            await axiosInstance.delete(APIPath.DELETE_ZONE(id));
            fetchData();
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus = !item.zoneStatus;

            await axiosInstance.put(
                APIPath.UPDATE_ZONE_STATUS(item.zone_id),
                { zoneStatus: String(newStatus) }
            );

            fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleToDetailZone = (id) => {
        navigate(`/user/zone-detail/${id}`);
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
                    onClick={() => setShowAddZone(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-white rounded font-medium"
                >
                    {t("addButton")}
                </button>
            </div>


            {/* 🔹 Grid เดิมทั้งหมด */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {zone?.map((item) => (
                    <div key={item.zone_id} className="flex hover:shadow-xl">
                        <div
                            onClick={() => handleToDetailZone(item.zone_id)}
                            className={`${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"
                                } text-white cursor-pointer w-full px-4 py-3 rounded-l shadow`}
                        >
                            <div className="ml-4 flex items-center gap-3 font-semibold">
                                <MapPinned />
                                {item.zoneName}
                            </div>

                            <div className="mt-2 ml-4 flex items-center gap-3">
                                <Clock3 />
                                {item.timeFix} {t("minuteLabel")}
                            </div>

                            <div className="mt-2 ml-4 font-semibold">
                                {item.zoneStatus ? t("statusFree") : t("statusFull")}
                            </div>
                        </div>

                        <div className={`flex flex-col items-center w-24 gap-2 px-2 rounded-r ${item.zoneStatus ? "bg-green-600" : "bg-[#E52020]"
                            } text-white`}
                        >
                            <Edit
                                className="mt-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEditZone(true);
                                    setZoneId(item.zone_id);
                                }}
                            />
                            <Trash
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.zone_id);
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(item);
                                }}
                                className="mt-2 px-2 py-1 bg-white text-black rounded text-sm"
                            >
                                {item.zoneStatus ? t("statusFree") : t("statusFull")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 Pagination เพิ่มเข้ามา (เหมือน TimeList) */}
            <div className="flex justify-end mt-4 gap-2 items-center">
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

            <EditZone
                show={showEditZone}
                onClose={() => setShowEditZone(false)}
                zoneId={zoneId}
                fetchZone={fetchData}
            />

            <AddZone
                show={showAddZone}
                onClose={() => setShowAddZone(false)}
                fetchZone={fetchData}
            />
        </div>
    );
};

export default ZoneList;