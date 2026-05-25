
import { useEffect, useState } from "react";
import { TimerIcon, Edit, Trash, MapPinned, MapPin, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import SelectDate from "../../utils/SelectDate";
import { formatDates } from "../../utils/FormatDate";
import { parseDate } from "../../utils/parseDate";
const TimeFixList = () => {
    const { t } = useTranslation("timeZone");
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState("today");
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


    // ================= CHECK TODAY =================

    const isToday = (date) => {
        const itemDate = parseDate(date);
        if (!itemDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        itemDate.setHours(0, 0, 0, 0);
        return (itemDate.getTime() === today.getTime());
    };

    // ================= CHECK TOMORROW =================

    const isTomorrow = (date) => {
        const itemDate = parseDate(date);
        if (!itemDate) return false;
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);
        itemDate.setHours(0, 0, 0, 0);
        return (itemDate.getTime() === tomorrow.getTime());
    };

    // ================= CARD COLOR =================

    const getCardColor = (date) => {
        if (isTomorrow(date)) { return "bg-red-600"; }
        if (isToday(date)) { return "bg-green-600"; }
        return "bg-orange-500";
    };


    // ================= FILTER DATA =================

    const filteredTimeFix = timeFix?.filter((item) => {
            const date = item?.time?.date;
            if (filterType === "today") {
                return isToday(date);
            }
            if (filterType === "tomorrow") {
                return isTomorrow(date);
            }
            if (filterType === "other") {
                return (
                    !isToday(date) &&
                    !isTomorrow(date)
                );
            }
            return true;
        });

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
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-3 mb-6">
                {/* today */}
                <button
                    onClick={() => setFilterType("today")}
                    className={`px-4 py-2 rounded text-white cursor-pointer ${filterType === "today"
                        ? "bg-green-700"
                        : "bg-green-500"
                        }`}
                >
                    {t("today")}
                </button>

                {/* tomorrow */}
                <button
                    onClick={() => setFilterType("tomorrow")}
                    className={`px-4 py-2 rounded text-white cursor-pointer ${filterType === "tomorrow"
                        ? "bg-red-700"
                        : "bg-red-500"
                        }`}
                >
                    {t("tomorrow")}
                </button>

                {/* other */}
                <button
                    onClick={() => setFilterType("other")}
                    className={`px-4 py-2 rounded text-white cursor-pointer ${filterType === "other"
                        ? "bg-orange-700"
                        : "bg-orange-500"
                        }`}
                >
                    {t("otherday")}
                </button>

            </div>
            {/* Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {filteredTimeFix?.map((item) => (
                    <div key={item.timefix_id} className="flex hover:shadow-xl">
                        <div className={`text-white cursor-pointer w-full px-4 py-3 rounded-l shadow ${getCardColor(item?.time?.date)}`} >
                            <div className="flex items-center gap-2">
                                <TimerIcon />
                                {item?.time?.time}
                            </div>
                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <MapPinned />
                                {item?.zone?.zoneName}
                            </div>
                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <MapPin />
                                {item?.branch?.branch_name}
                            </div>
                            <div className="mt-2 flex items-center gap-2 font-semibold">
                                <Calendar />
                                {item?.time?.date || formatDates(item?.time?.date)}
                            </div>

                        </div>

                        <div
                            className={`flex flex-col items-center w-24 gap-2 px-2 rounded-r text-white ${getCardColor(item?.time?.date)}`}
                        >
                            <Eye
                                className="mt-2 cursor-pointer"
                                onClick={() => handleToDetailTime(item.timefix_id)}
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
        </div>
    );
};

export default TimeFixList;