import { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import SelectDate from "../../utils/SelectDate";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import AddStore from "./AddStore";
import EditStore from "./EditStore";

const StoreList = () => {
    const { t } = useTranslation("store");
    const [showAddStore, setShowAddStore] = useState(false);
    const [showEditStore, setShowEditStore] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const navigate = useNavigate();

    const {
        data: stores,
        page,
        totalPage,
        search,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
        totalCount,
        rangeStart,
        rangeEnd,
        inputPage,
        handleInputPageChange,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) =>
            axiosInstance.get(APIPath.GET_ALL_STORE, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            }),
    });

    const handleDelete = async (store_id) => {
        try {
            const confirmed = await DeleteAlert(t("delete_confirm"), t("delete_success"));
            if (confirmed) {
                await axiosInstance.delete(APIPath.DELETE_STORE(store_id));
                fetchData();
            }
        } catch (error) {
            console.error("Delete Store failed:", error);
            SuccessAlert(t("delete_error"), 1500, "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="flex justify-end items-center mb-6 gap-3">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                <button
                    onClick={() => setShowAddStore(true)}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base"
                >
                    {t("add_store")}
                </button>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {stores?.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                ) : (
                    stores?.map((item, index) => (
                        <div key={item.store_id || index} className="bg-white rounded-lg shadow-md p-4">
                            {item.image && (
                                <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-lg mb-3" />
                            )}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.address}</p>
                                    <p className="text-sm text-gray-500">{item.phone}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {item.status ? t("open") : t("closed")}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <Eye
                                        className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                        onClick={() => navigate(`/user/store-detail/${item.store_id}`)}
                                    />
                                    <Edit
                                        className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                        onClick={() => { setSelectedStore(item.store_id); setShowEditStore(true); }}
                                    />
                                    <Trash
                                        className="text-gray-600 w-4 h-4 hover:text-red-600 cursor-pointer"
                                        onClick={() => handleDelete(item.store_id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full h-12 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-7 gap-3 px-4 lg:px-6 py-3 md:py-4 font-medium text-sm">
                        <div className="text-center">{t("index")}</div>
                        <div className="text-center">{t("image")}</div>
                        <div className="text-center">{t("store_name")}</div>
                        <div className="text-center">{t("address")}</div>
                        <div className="text-center">{t("phone")}</div>
                        <div className="text-center">{t("status")}</div>
                        <div className="text-center">{t("action")}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {stores?.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        stores?.map((item, index) => (
                            <div
                                key={item.store_id || index}
                                className="grid grid-cols-7 gap-3 px-3 lg:px-4 py-3 lg:py-4 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-sm text-center">{index + 1}</div>
                                <div className="flex justify-center">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                    )}
                                </div>
                                <div className="text-sm text-center line-clamp-1">{item.name}</div>
                                <div className="text-sm text-center line-clamp-2">{item.address}</div>
                                <div className="text-sm text-center">{item.phone}</div>
                                <div className="text-sm text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {item.status ? t("open") : t("closed")}
                                    </span>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Eye
                                        className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/user/store-detail/${item.store_id}`); }}
                                    />
                                    <Edit
                                        className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStore(item.store_id);
                                            setShowEditStore(true);
                                        }}
                                    />
                                    <Trash
                                        className="text-gray-600 w-4 h-4 hover:text-red-600 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.store_id);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">
                <div className="text-sm text-gray-500">
                    {t("item_range")} <span className="font-semibold text-gray-700">{rangeStart} - {rangeEnd}</span> {t("from")} <span className="font-semibold text-gray-700">{totalCount}</span> {t("item_range")}
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-500">{t("to")}:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPage}
                        value={inputPage}
                        onChange={(e) => handleInputPageChange(e.target.value)}
                        className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-500">{t("of")} {totalPage}</span>
                    <button onClick={() => handlePageChange(1)} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>‹‹</button>
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>‹</button>
                    {getPageNumbers().map((p) => (
                        <button key={p} onClick={() => handlePageChange(p)} className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{p}</button>
                    ))}
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPage || totalPage === 0} className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>›</button>
                    <button onClick={() => handlePageChange(totalPage)} disabled={page === totalPage || totalPage === 0} className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>››</button>
                </div>
            </div>

            <AddStore show={showAddStore} onClose={() => setShowAddStore(false)} handleFetchStore={fetchData} />
            <EditStore show={showEditStore} onClose={() => setShowEditStore(false)} store_id={selectedStore} handleFetchStore={fetchData} />
        </div>
    );
};

export default StoreList;
