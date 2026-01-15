import { Car, Edit, Eye, Trash } from "lucide-react";
import EditService from "./EditService";
import AddService from "./AddService";
import { DeleteAlert } from "../../../utils/handleAlert/DeleteAlert";
import SelectDate from "../../../utils/SelectDate";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { filterSearch } from "../../../utils/FilterSearch";
import { filterByDateRange } from "../../../utils/FilterDate";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const ServiceList = () => {
    const { t } = useTranslation("service");

    const [showEditService, setShowEditService] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Fetch services from the API
    const handleFetchService = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_SERVICE);
            console.log("service length : ",res?.data?.data.length);
            setServices(res?.data?.data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        }
    };

    // Delete service
    const handleDeleteService = async (id) => {
        try {
            const confirmDelete = await DeleteAlert(
                t("confirm_delete_service"),
                t("deleted_success")
            );
            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_SERVICE(id));
                handleFetchService();
            }
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    useEffect(() => {
        handleFetchService();
    }, []);

    // Navigate to detail
    const handleToDetailService = (id) => {
        navigate(`/user/service-detail/${id}`);
    };

    const filteredServices = filterByDateRange(
        filterSearch(services, "serviceName", search),
        startDate,
        endDate,
        "createdAt"
    );

    // const handleRefresh = (e) => {
    //     e.preventDefault();
    //     setSearch("");
    //     setStartDate(null);
    //     setEndDate(null);
    // };

    return (
        <div className="p-4">
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-4">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("search_placeholder")}
                    onDateChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                />
                {/* <button
                    onClick={handleRefresh}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded text-sm"
                >
                    {t("reset")}
                </button> */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={() => setShowAddService(true)}
                        className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-10 py-2.5 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base"
                    >
                        {t("add")}
                    </button>
                </div>
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
                    {filteredServices.map((item, index) => (
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
                            <div className="text-center">{item.serviceName}</div>
                            <div className="text-center">{item.description}</div>
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
                    {filteredServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
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
                                    <h3 className="font-semibold text-base text-gray-900">
                                        {item.serviceName}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
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

            {/* Popups */}
            <EditService
                show={showEditService}
                onClose={() => setShowEditService(false)}
                serviceId={selectedService}
                handleFetch={handleFetchService}
            />
            <AddService
                show={showAddService}
                onClose={() => setShowAddService(false)}
                handleFetch={handleFetchService}
            />
        </div>
    );
};

export default ServiceList;
