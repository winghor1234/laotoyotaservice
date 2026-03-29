
import { useEffect, useState } from "react";
import { Calendar, TimerIcon, Edit, Trash, MapPinned, Search, MapPinnedIcon, MapPinPen, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import SelectDate from "../../utils/SelectDate";
import AddTimeFix from "./AddTimeFix";
import EditTimeFix from "./EditTimeFix";
const TimeFixList = () => {
    const { t } = useTranslation("timeZone");

    const [showAddTime, setShowAddTime] = useState(false);
    const [showEditTime, setShowEditTime] = useState(false);
    const [timeFixId, setTimeFixId] = useState(null);
    const navigate = useNavigate();

    // ✅ ใช้ Server Pagination
    const {
        data: timeFix,
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
            return axiosInstance.get(APIPath.GET_ALL_TIME_FIX, {
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
        navigate(`/user/time-fix-detail/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = await DeleteAlert(
            t("timeDeleteConfirm"),
            t("timeDeleteSuccess")
        );
        if (confirmDelete) {
            await axiosInstance.delete(APIPath.DELETE_TIME_FIX(id));
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
                    apiPath={APIPath.GET_ALL_TIME_FIX}
                    fileName={"time-fix-report.xlsx"}
                />
                {/* download button */}
                {/* <DownloadButton open={open} setOpen={setOpen} /> */}
                <button
                    onClick={() => setShowAddTime(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-white rounded font-medium"
                >
                    {t("addButton")}
                </button>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {timeFix?.map((item) => (
                    <div key={item.timefix_id} className="flex hover:shadow-xl">
                        <div
                            onClick={() => handleToDetailTime(item.timefix_id)}
                            className={` text-white cursor-pointer w-full  bg-green-600 px-4 py-3 rounded-l shadow`}>
                            <div className="flex items-center gap-2">
                                <TimerIcon />
                                {item?.time?.time}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <Calendar />
                                {item?.time?.date}
                            </div>

                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <MapPinned />
                                {item?.zone?.zoneName}
                            </div>
                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <MapPin />
                                {item?.branch?.branch_name}
                            </div>
                            
                        </div>

                        <div className={`flex flex-col items-center w-24 gap-2 px-2 rounded-r bg-green-600 text-white`}>
                            <Edit
                                className="mt-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEditTime(true);
                                    setTimeFixId(item.timefix_id);
                                }}
                            />
                            <Trash
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.timefix_id);
                                }}
                            />
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
            <EditTimeFix
                show={showEditTime}
                onClose={() => setShowEditTime(false)}
                timefix_id={timeFixId}
                fetchTimeFix={fetchData}
            />

            <AddTimeFix
                show={showAddTime}
                onClose={() => setShowAddTime(false)}
                fetchTimeFix={fetchData}
            />

            
        </div>
    );
};

export default TimeFixList;