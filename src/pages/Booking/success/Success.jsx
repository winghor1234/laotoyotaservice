import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import BookingSearch from "../../../utils/BookingSearch";
import logo from "../../../assets/corrects.png";
import { useTranslation } from "react-i18next";
import { useCheckRole } from "../../../utils/checkRole";
import { useEmployeeBranchId } from "../../../utils/useEmployeeBranchId";

const Success = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("booking");

    const [bookings, setBookings] = useState([]);
    const [fixes, setFixes] = useState([]);
    const [exportData, setExportData] = useState([]);
    const role = useCheckRole();
    const branch_id = useEmployeeBranchId();


    const fetchData = async () => {
        try {
            const apiPath = role === "super_admin"
                ? APIPath.SELECT_ALL_BOOKING
                : APIPath.SELECT_BOOKING_BY_BRANCH(branch_id);

            const [bookingRes, fixRes] = await Promise.all([
                axiosInstance.get(apiPath),
                axiosInstance.get(APIPath.SELECT_ALL_FIX),
            ]);

            const bookingsData = bookingRes?.data?.data || [];
            const fixesData = fixRes?.data?.data || [];

            setBookings(bookingsData);
            setFixes(fixesData);

            setExportData(
                bookingsData
                    ?.filter((booking) =>
                        fixesData?.some(
                            (f) => f.bookingId === booking.booking_id && f.fixStatus === "success"
                        )
                    )
                    ?.map((item) => ({
                        [t("car")]: item?.car?.model,
                        [t("customerName")]: item?.user?.username,
                        [t("phone")]: item?.user?.phoneNumber,
                        [t("plate")]: item?.car?.plateNumber,
                        [t("date_label")]: item?.time?.date,
                        [t("time_label")]: item?.time?.time,
                    }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fixDetail = (id) => {
        const fixId = fixes.find((f) => f.bookingId === id)?.fix_id;
        if (!fixId) return;
        navigate(`/user/successDetail/${fixId}`);
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) =>
            fixes.some((f) => f.bookingId === booking.booking_id && f.fixStatus === "success")
        );
    }, [bookings, fixes]);

    const handleSearch = async ({ searchText }) => {
        try {
            const res = await axiosInstance.get(`${APIPath.SEARCH_BOOKING}?search=${searchText}`);
            setBookings(res?.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (role !== "super_admin" && !branch_id) return;
        fetchData();
    }, [role, branch_id]);

    return (
        <div className="p-4">
            <BookingSearch onSearch={handleSearch} exportData={exportData} setExportData={setExportData} fetchBooking={fetchData} />
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mt-4">
                {/* Desktop/Tablet Header */}
                <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                    <div className="grid grid-cols-6 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
                        <div className="text-center">{t("booking")}</div>
                        <div className="text-center">{t("customerName")}</div>
                        <div className="text-center">{t("phone")}</div>
                        <div className="text-center">{t("plate")}</div>
                        <div className="text-center">{t("date_label")}</div>
                        <div className="text-center">{t("time_label")}</div>
                    </div>
                </div>

                {/* Desktop/Tablet Body */}
                <div className="hidden md:block divide-y divide-gray-200 overflow-auto max-h-[400px]">
                    {filteredBookings.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => fixDetail(item.booking_id)}
                            className="grid grid-cols-6 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer text-xs md:text-sm lg:text-base"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img src={logo} alt="success" className="h-full w-full object-contain" />
                                </div>
                                <span className="line-clamp-1">{item?.car?.model}</span>
                            </div>
                            <div className="text-center line-clamp-1">{item?.user?.username}</div>
                            <div className="text-center line-clamp-1">{item?.user?.phoneNumber}</div>
                            <div className="text-center line-clamp-1">{item?.car?.plateNumber}</div>
                            <div className="text-center line-clamp-1">{item?.time?.date}</div>
                            <div className="text-center line-clamp-1">{item?.time?.time}</div>
                        </div>
                    ))}
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => fixDetail(item.booking_id)}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img src={logo} alt="success" className="h-8 w-8 object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base text-gray-900">{item?.car?.model}</h3>
                                    <p className="text-gray-600 text-sm">{item?.user?.username}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("phone")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("plate")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.car?.plateNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("date_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.time?.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 line-clamp-1">{t("time_label")}:</span>
                                    <span className="text-gray-900 line-clamp-1">{item?.time?.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Success;
