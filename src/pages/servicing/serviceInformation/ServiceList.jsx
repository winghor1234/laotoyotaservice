import { Car, Edit, Eye, Trash } from "lucide-react";
import EditService from "./EditService";
import AddService from "./AddService";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import useServerFilterPagination from "../../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../../utils/exportExelPopup";
import SelectDate from "../../../utils/SelectDate";
import DownloadButton from "../../../utils/DownloadButton";

const ServiceList = () => {
    const { t } = useTranslation("service");

    const [showEditService, setShowEditService] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    // Fetch services from the API
    const {
        data: service,
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
            return axiosInstance.get(APIPath.GET_ALL_SERVICE, {
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

    // Delete service
    const handleDeleteService = async (id) => {
        try {
            const confirmDelete = await DeleteAlert(
                t("confirm_delete_service"),
                t("deleted_success")
            );
            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_SERVICE(id));
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Navigate to detail
    const handleToDetailService = (id) => {
        navigate(`/user/service-detail/${id}`);
    };


    // const handleRefresh = (e) => {
    //     e.preventDefault();
    //     setSearch("");
    //     setStartDate(null);
    //     setEndDate(null);
    // };

    return (
        <div>
            <div className="mb-6 flex justify-end items-center">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                {/* download button */}
                <DownloadButton open={open} setOpen={setOpen} />
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_SERVICE}
                        fileName="service-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                <button
                    onClick={() => setShowAddService(true)}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base"
                >
                    {t("add")}
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                {/* Table Header (Desktop/Tablet only) */}
                <div className="hidden md:block w-full h-10 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-5 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
                        <div className="text-center">{t("table.index")}</div>
                        <div className="text-center">{t("table.image")}</div>
                        <div className="text-center">{t("table.name")}</div>
                        <div className="text-center">{t("table.detail")}</div>
                        <div className="text-center">{t("table.action")}</div>
                    </div>
                </div>

                {/* Table Body (Desktop/Tablet) */}
                <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {service.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleToDetailService(item.service_id)}
                            className="grid grid-cols-5 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors text-xs md:text-sm lg:text-base"
                        >
                            <div className="text-center">{index + 1}</div>
                            <div className="flex justify-center">
                                {item.image && (
                                    <img
                                        src={item.image}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        alt="service"
                                    />
                                )}
                            </div>
                            <div className="text-center line-clamp-1">{item.serviceName}</div>
                            <div className="text-center line-clamp-2 ">{item.description}</div>
                            <div className="flex justify-center gap-4">
                                <Eye />
                                <Edit
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEditService(true);
                                        setSelectedService(item.service_id);
                                    }}
                                />
                                <Trash
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteService(item.service_id);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {service.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleToDetailService(item.service_id)}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Car className="text-gray-600 w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
                                        {item.serviceName}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-2 text-sm">{item.description}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 text-gray-600">
                                <Edit
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEditService(true);
                                        setSelectedService(item.service_id);
                                    }}
                                />
                                <Trash
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteService(item.service_id);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
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
            <EditService
                show={showEditService}
                onClose={() => setShowEditService(false)}
                serviceId={selectedService}
                handleFetch={fetchData}
            />
            <AddService
                show={showAddService}
                onClose={() => setShowAddService(false)}
                handleFetch={fetchData}
            />
        </div>
    );
};

export default ServiceList;

