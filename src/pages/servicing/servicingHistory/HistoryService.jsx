import { Car } from "lucide-react";
import { useState, useEffect } from "react";
import SelectDate from "../../../utils/SelectDate";
import { useNavigate } from "react-router-dom";
import { filterSearch } from "../../../utils/FilterSearch";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const ServiceHistory = () => {
    const { t } = useTranslation("service");

    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleFetchService = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_SERVICE);
            setServices(res?.data?.data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        }
    };

    useEffect(() => {
        handleFetchService();
    }, []);

    const handleToDetailService = (id) => {
        navigate(`/user/service-detail/${id}`);
    };

    const filteredServices = filterSearch(services, "serviceName", search);

    return (
        <div className="p-4">
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-4 overflow-hidden flex-1">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("search_placeholder")}
                />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full flex flex-col flex-1">
                {/* Desktop/Tablet Table Header */}
                <div className="hidden md:block w-full h-10 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-4 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-sm lg:text-base">
                        <div className="flex justify-center items-center">{t("table.index")}</div>
                        <div className="flex justify-center items-center">{t("table.image")}</div>
                        <div className="flex justify-center items-center">{t("table.name")}</div>
                        <div className="flex justify-center items-center">{t("table.detail")}</div>
                    </div>
                </div>

                {/* Desktop/Tablet Table Body */}
                <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {filteredServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div
                            onClick={() => handleToDetailService(item.service_id)}
                            key={index}
                            className="grid grid-cols-4 gap-3 md:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors shadow-md"
                        >
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{index + 1}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                {item.image && <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />}
                            </div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{item.serviceName}</div>
                            <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">{item.description}</div>
                        </div>
                    ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredServices.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleToDetailService(item.service_id)}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Car className="text-gray-600 w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">{item.serviceName}</h3>
                                    <p className="text-gray-600 text-base">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceHistory;
