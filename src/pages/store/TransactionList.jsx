import { useEffect } from "react";
import { Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import SelectDate from "../../utils/SelectDate";
import useServerFilterPagination from "../../utils/useServerFilterPagination";

const TransactionList = () => {
    const { t } = useTranslation("store");
    const navigate = useNavigate();
    const {
        data: transactions,
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
            axiosInstance.get(APIPath.GET_ALL_TRANSACTION, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            }),
    });

    const handleDelete = async (transaction_id) => {
        try {
            const confirmed = await DeleteAlert(t("delete_txn_confirm"), t("delete_txn_success"));
            if (confirmed) {
                await axiosInstance.delete(APIPath.DELETE_TRANSACTION(transaction_id));
                fetchData();
            }
        } catch (error) {
            console.error("Delete Transaction failed:", error);
            SuccessAlert(t("delete_txn_error"), 1500, "error");
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
            </div>

            {/* Mobile Card */}
            <div className="md:hidden space-y-4 mb-6">
                {transactions?.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                ) : (
                    transactions?.map((item, index) => (
                        <div key={item.transaction_id || index} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                                    <p className="font-semibold text-gray-800">{item.card?.user?.username || "-"}</p>
                                    <p className="text-sm text-gray-500">{t("store")}: {item.store?.name || "-"}</p>
                                    <p className="text-sm text-gray-500">{t("discount")}: <span className="font-bold text-green-600">{item.discount}%</span></p>
                                    <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString("lo-LA")}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Eye
                                        className="text-gray-400 w-4 h-4 hover:text-gray-700 cursor-pointer mt-1"
                                        onClick={() => navigate(`/user/transaction-detail/${item.transaction_id}`)}
                                    />
                                    <Trash
                                        className="text-gray-400 w-4 h-4 hover:text-red-600 cursor-pointer mt-1"
                                        onClick={() => handleDelete(item.transaction_id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full bg-[#E52020] text-white">
                    <div className="grid grid-cols-7 gap-3 px-4 lg:px-6 py-3 md:py-4 font-medium text-sm">
                        <div className="text-center">{t("index")}</div>
                        <div className="text-center">{t("code")}</div>
                        <div className="text-center">{t("customer")}</div>
                        <div className="text-center">{t("store")}</div>
                        <div className="text-center">{t("discount")}</div>
                        <div className="text-center">{t("date")}</div>
                        <div className="text-center">{t("action")}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {transactions?.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        transactions?.map((item, index) => (
                            <div
                                key={item.transaction_id || index}
                                className="grid grid-cols-7 gap-3 px-3 lg:px-4 py-3 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-sm text-center">{index + 1}</div>
                                <div className="text-xs text-center font-mono text-gray-500 line-clamp-1">{item.code}</div>
                                <div className="text-sm text-center line-clamp-1">{item.card?.user?.username || "-"}</div>
                                <div className="text-sm text-center line-clamp-1">{item.store?.name || "-"}</div>
                                <div className="text-sm text-center font-bold text-green-600">{item.discount}%</div>
                                <div className="text-xs text-center text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString("lo-LA")}
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Eye
                                        className="text-gray-400 w-4 h-4 hover:text-gray-700 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/user/transaction-detail/${item.transaction_id}`); }}
                                    />
                                    <Trash
                                        className="text-gray-400 w-4 h-4 hover:text-red-600 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.transaction_id); }}
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
        </div>
    );
};

export default TransactionList;
