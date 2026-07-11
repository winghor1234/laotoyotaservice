import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import AddColor from "./AddColor";
import EditColor from "./EditColor";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import SelectDate from "../../utils/SelectDate";

const ColorList = () => {
    const { t } = useTranslation("color");

    const [colorId, setColorId] = useState(null);
    const [showAddColor, setShowAddColor] = useState(false);
    const [showEditColor, setShowEditColor] = useState(false);

    // const {
    //     data: color,
    //     page,
    //     totalPage,
    //     search,
    //     handleSearch,
    //     handlePageChange,
    //     fetchData,
    //     getPageNumbers,
    // } = useServerFilterPagination({
    //     apiCall: ({ page, limit = 12, search }) => {
    //         return axiosInstance.get(APIPath.GET_ALL_COLOR, {
    //             params: {
    //                 page,
    //                 limit,
    //                 search: search || undefined,
    //             },
    //         });
    //     },
    // });

    const {
        data: color,
        page,
        totalPage,
        search,
        handleSearch,
        handlePageChange,
        fetchData,
        getPageNumbers,
        totalCount,
        rangeStart,
        rangeEnd,
        inputPage,
        handleInputPageChange,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            return axiosInstance.get(APIPath.GET_ALL_COLOR, {
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

    const handleDelete = async (id) => {
        const confirm = await DeleteAlert(
            t("delete_confirm"),
            t("delete_success")
        );
        if (confirm) {
            await axiosInstance.delete(APIPath.DELETE_COLOR(id));
            fetchData();
        }
    };

    return (
        <div>
            <div className="gap-9 mb-6 flex justify-end items-center">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    placeholder={t("search_placeholder")}
                />
                <button
                    onClick={() => setShowAddColor(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-white rounded font-medium"
                >
                    {t("add_color")}
                </button>
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full h-12 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-3 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-sm lg:text-base">
                        <div className="text-center line-clamp-1">{t("index")}</div>
                        <div className="text-center line-clamp-1">{t("color_name")}</div>
                        <div className="text-center line-clamp-1">{t("action")}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {color?.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        color?.map((item, index) => (
                            <div
                                key={item.color_id}
                                className="grid grid-cols-3 gap-3 md:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                    {(page - 1) * 12 + index + 1}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-1">
                                    {item.colorName}
                                </div>
                                <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-3 md:gap-6">
                                    <Edit
                                        className="text-gray-600 w-4 h-4 md:w-5 md:h-5 hover:text-gray-800 cursor-pointer"
                                        onClick={() => {
                                            setShowEditColor(true);
                                            setColorId(item.color_id);
                                        }}
                                    />
                                    <Trash
                                        className="text-gray-600 w-4 h-4 md:w-5 md:h-5 hover:text-gray-800 cursor-pointer"
                                        onClick={() => handleDelete(item.color_id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {color?.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                ) : (
                    color?.map((item, index) => (
                        <div
                            key={item.color_id}
                            className="bg-white rounded-lg shadow-md p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-500">{t("index")}: {(page - 1) * 12 + index + 1}</div>
                                    <div className="font-medium text-gray-900">{item.colorName}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Edit
                                        className="text-gray-600 w-5 h-5 hover:text-gray-800 cursor-pointer"
                                        onClick={() => {
                                            setShowEditColor(true);
                                            setColorId(item.color_id);
                                        }}
                                    />
                                    <Trash
                                        className="text-gray-600 w-5 h-5 hover:text-gray-800 cursor-pointer"
                                        onClick={() => handleDelete(item.color_id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination (แก้ไขให้โชว์แค่บางช่วงหน้า) */}
            <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">

                {/* ສະແດງ range */}
                <div className="text-sm text-gray-500">
                    {t("list")}{" "}
                    <span className="font-semibold text-gray-700">{rangeStart} - {rangeEnd}</span>
                    {" "}{t("from")}{" "}
                    <span className="font-semibold text-gray-700">{totalCount}</span>
                    {" "}{t("list")}
                </div>

                <div className="flex gap-4 items-center">

                    {/* ໄປໜ້າ input */}
                    <span className="text-sm text-gray-500">{t("to")}:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPage}
                        value={inputPage}
                        onChange={(e) => handleInputPageChange(e.target.value)}
                        className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-500">{t("from")} {totalPage}</span>

                    {/* ‹‹ ໜ້າທຳອິດ */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ‹‹
                    </button>

                    {/* ‹ ຖອຍຫຼັງ */}
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ‹
                    </button>

                    {/* ເລກໜ້າ */}
                    {getPageNumbers().map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* › ໜ້າຕໍ່ໄປ */}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPage || totalPage === 0}
                        className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ›
                    </button>

                    {/* ›› ໜ້າສຸດທ້າຍ */}
                    <button
                        onClick={() => handlePageChange(totalPage)}
                        disabled={page === totalPage || totalPage === 0}
                        className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        ››
                    </button>

                </div>
            </div>

            <EditColor
                show={showEditColor}
                onClose={() => setShowEditColor(false)}
                colorId={colorId}
                fetchColor={fetchData}
            />

            <AddColor
                show={showAddColor}
                onClose={() => setShowAddColor(false)}
                fetchColor={fetchData}
            />
        </div>
    );
};

export default ColorList;
