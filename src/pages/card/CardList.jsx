import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectDate from "../../utils/SelectDate";
import { Edit, Eye, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import EditCard from "./EditCard";
import AddCard from "./AddCard";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import DownloadButton from "../../utils/DownloadButton";
import ExportExcelPopup from "../../utils/exportExelPopup";
import useServerFilterPagination from "../../utils/useServerFilterPagination";



const CardList = () => {
    const { t } = useTranslation("card");

    const [showEditCard, setShowEditCard] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const {
        data: cards,
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
            return axiosInstance.get(APIPath.GET_ALL_CARD, {
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

    const handleDeleteCard = async (cardId) => {
        console.log("cardId: ", cardId);
        try {
            const confirmDelete = await DeleteAlert(
                t("delete_confirm"),
                t("delete_success")
            );

            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_CARD(cardId));
                fetchData();
            }
        } catch (error) {
            console.error(error);
            SuccessAlert(t("delete_error"), 1500, "error");
        }
    };

    const handleToDetailCard = (id) => {
        navigate(`/user/card-detail/${id}`);
    };


    return (
        <div>
            {/* Top Section */}
            <div className="flex justify-end items-center mb-6">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />

                <DownloadButton open={open} setOpen={setOpen} />

                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_CARD}
                        fileName="card-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}

                <div className="flex gap-2 ">
                    <button
                        onClick={() => setShowAddCard(true)}
                        className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base"
                    >
                        {t("add")}
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4 mb-6">
                {cards?.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">
                        {t("no_data")}
                    </div>
                ) : (
                    cards?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">
                                    #{index + 1}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Eye
                                        onClick={() =>
                                            handleToDetailCard(item.card_id)
                                        }
                                        className="text-gray-600 h-4 w-4 hover:text-gray-800"
                                    />

                                    <Edit
                                        className="text-gray-600 h-4 w-4 hover:text-gray-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCard(item.card_id);
                                            setShowEditCard(true);
                                        }}
                                    />

                                    <Trash
                                        className="text-gray-600 h-4 w-4 hover:text-gray-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCard(item.card_id);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        {t("card_number")}
                                    </p>
                                    <p className="font-semibold">
                                        {item.card_number}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        {t("customer_number")}
                                    </p>
                                    <p>{item.customer_number}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        {t("vip_number")}
                                    </p>
                                    <p>{item.vip_number}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        {t("discount")}
                                    </p>
                                    <p>{item.discount}%</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full flex-col flex-1">
                <div className="w-full h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-6 gap-4 px-4 py-4 font-medium text-base">
                        <div className="flex justify-center items-center">
                            {t("index")}
                        </div>

                        <div className="flex justify-center items-center">
                            {t("card_number")}
                        </div>

                        <div className="flex justify-center items-center">
                            {t("customer_number")}
                        </div>

                        <div className="flex justify-center items-center">
                            {t("vip_number")}
                        </div>

                        <div className="flex justify-center items-center">
                            {t("discount")}
                        </div>

                        <div className="flex justify-center items-center">
                            {t("action")}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {cards
                        ?.sort(
                            (a, b) =>
                                new Date(b.createdAt) -
                                new Date(a.createdAt)
                        )
                        .map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-6 gap-4 px-4 py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                            >
                                <div className="flex justify-center items-center">
                                    {index + 1}
                                </div>

                                <div className="text-center">
                                    {item.card_number}
                                </div>

                                <div className="text-center">
                                    {item.customer_number}
                                </div>

                                <div className="text-center">
                                    {item.vip_number}
                                </div>

                                <div className="text-center">
                                    {item.discount}%
                                </div>

                                <div className="flex justify-center items-center gap-4">
                                    <Eye
                                        onClick={() =>
                                            handleToDetailCard(item.card_id)
                                        }
                                        className="text-gray-600 h-5 w-5 hover:text-gray-800"
                                    />

                                    <Edit
                                        className="text-gray-600 h-5 w-5 hover:text-gray-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCard(item.card_id);
                                            setShowEditCard(true);
                                        }}
                                    />

                                    <Trash
                                        className="text-gray-600 h-5 w-5 hover:text-gray-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCard(item.card_id);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-4 gap-2 items-center">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${page === 1
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    ‹
                </button>

                {getPageNumbers().map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-1 rounded ${page === p
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
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

            <EditCard
                show={showEditCard}
                onClose={() => setShowEditCard(false)}
                cardId={selectedCard}
                handleFetchCard={fetchData}

            />

            <AddCard
                show={showAddCard}
                onClose={() => setShowAddCard(false)}
                handleFetchCard={fetchData}
            />
        </div>
    );
};

export default CardList;