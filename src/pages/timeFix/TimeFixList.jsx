
import { useEffect } from "react";
import { TimerIcon, Edit, Trash, MapPinned, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import SelectDate from "../../utils/SelectDate";
const TimeFixList = () => {
    const { t } = useTranslation("timeZone");
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
    // console.log("time fix : ",timeFix);

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
            {/* Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {timeFix?.map((item) => (
                    <div key={item.timefix_id} className="flex hover:shadow-xl">
                        <div
                            className={` text-white cursor-pointer w-full  bg-green-600 px-4 py-3 rounded-l shadow`}>
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

                        </div>

                        <div className={`flex flex-col items-center w-24 gap-2 px-2 rounded-r bg-green-600 text-white`}>
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