

import {  Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Clock3, Car, Gift, MapPinHouse } from "lucide-react";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LiaGiftsSolid } from "react-icons/lia";
import { GrUserAdmin } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { calculatePercentIncrease, countUsersByMonth, getIncomes } from "../../utils/Income";
import ChartsSection from "./ChartsSection";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";

// ✅ Lazy load recharts — ໂຫຼດສະເພາະຕອນໃຊ້ (ຫຼຸດ bundle ~500kB));

const Dashboard = () => {
    const { t } = useTranslation("dashboard");
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [booking, setBooking] = useState([]);
    const [car, setCar] = useState([]);
    const [gift, setGift] = useState([]);
    const [time, setTime] = useState([]);
    const [zone, setZone] = useState([]);
    const [service, setService] = useState([]);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    const [percentUserIncrease, setPercentUserIncrease] = useState(0);
    const [loading, setLoading] = useState(true); // ✅ loading state

    const fetchData = async () => {
        try {
            setLoading(true);

            // ✅ ດຶງທຸກ API ພ້ອມກັນໝົດ (ລວມ FIX ດ້ວຍ)
            const [
                userRes,
                promoRes,
                bookingRes,
                carRes,
                giftRes,
                timeRes,
                zoneRes,
                serviceRes,
                fixRes,
            ] = await Promise.all([
                axiosInstance.get(APIPath.SELECT_ALL_USER),
                axiosInstance.get(APIPath.SELECT_ALL_PROMOTION),
                axiosInstance.get(APIPath.SELECT_ALL_BOOKING),
                axiosInstance.get(APIPath.SELECT_ALL_CAR),
                axiosInstance.get(APIPath.SELECT_ALL_GIFT),
                axiosInstance.get(APIPath.SELECT_ALL_TIME),
                axiosInstance.get(APIPath.SELECT_ALL_ZONE),
                axiosInstance.get(APIPath.SELECT_ALL_SERVICE),
                axiosInstance.get(APIPath.SELECT_ALL_FIX),
            ]);

            // ✅ ໃຊ້ variable ໂດຍກົງ (ບໍ່ໃຊ້ state ທີ່ຍັງ update ບໍ່ທັນ)
            const userData = userRes?.data?.data || [];
            const fixData = fixRes?.data?.data || [];

            // ✅ ຄຳນວນຈາກ data ໂດຍກົງ — ບໍ່ async, ບໍ່ fetch ຊ້ຳ
            const { monthlyData, totalPrice } = getIncomes(fixData);
            const { thisMonthCount, lastMonthCount } = countUsersByMonth(userData);
            const percent = calculatePercentIncrease(thisMonthCount, lastMonthCount);

            // ✅ set states ທັງໝົດ
            setUsers(userData);
            setPromotions(promoRes?.data?.data || []);
            setBooking(bookingRes?.data?.data || []);
            setCar(carRes?.data?.data || []);
            setGift(giftRes?.data?.data || []);
            setTime(timeRes?.data?.data || []);
            setZone(zoneRes?.data?.data || []);
            setService(serviceRes?.data?.data || []);
            setMonthlyIncomes(monthlyData);
            setTotalIncomes(totalPrice);
            setPercentUserIncrease(percent);
        } catch (error) {
            console.error("Fetch Dashboard Data Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // ✅ ເອີ້ນແຕ່ຄັ້ງດຽວ

    const handleApprove = (bookingId, timeId) => {
        navigate(`/user/receiverCarDetail/${bookingId}?time=${timeId}`);
    };

    const dashboardItems = [
        {
            title: t("customer_info"),
            path: "/user/user",
            value: users.filter((u) => u.role === "general").length,
            icon: <Users className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("promotion_info"),
            path: "/user/promotion",
            value: promotions.length,
            icon: <Gift className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("gift"),
            path: "/user/gift",
            value: gift.length,
            icon: <LiaGiftsSolid className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("car_info"),
            path: "/user/car",
            value: car.length,
            icon: <Car className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("servicing_info"),
            path: "/user/servicing",
            value: service.length,
            icon: <HiOutlineWrenchScrewdriver className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("time_info"),
            path: "/user/time",
            value: time.length,
            icon: <Clock3 className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("zone"),
            path: "/user/zone",
            value: zone.length,
            icon: <MapPinHouse className="w-10 h-10 text-red-600" />,
        },
        {
            title: t("user_permission"),
            path: "/user/admin",
            value: users.filter((u) => u.role === "admin").length,
            icon: <GrUserAdmin className="w-10 h-10 text-red-600" />,
        },
    ];

    return (
        <div className="p-4 bg-gray-50 min-h-screen">

            {/* ✅ Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dashboardItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-4 hover:shadow-2xl transition cursor-pointer"
                    >
                        {item.icon}
                        <p className="mt-2 text-lg font-medium text-center">{item.title}</p>
                        {/* ✅ Skeleton ຕອນ loading */}
                        {loading ? (
                            <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1" />
                        ) : (
                            <h1 className="text-xl font-bold mt-1">{item.value}</h1>
                        )}
                    </Link>
                ))}
            </div>

            {/* ✅ Charts — Lazy load, ໂຫຼດຫຼັງ cards ສຳເລັດ */}
            <Suspense
                fallback={
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
                        <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                }
            >
                <ChartsSection
                    percentUserIncrease={percentUserIncrease}
                    users={users}
                    monthlyIncomes={monthlyIncomes}
                    totalIncomes={totalIncomes}
                />
            </Suspense>

            {/* ✅ Booking Table */}
            <h2 className="text-lg font-medium mt-6 mb-2">{t("latest_booking")}</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">

                {/* Desktop */}
                <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        // ✅ Skeleton rows ຕອນ loading
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="grid grid-cols-6 gap-4 px-4 py-3">
                                {[...Array(6)].map((_, j) => (
                                    <div key={j} className="h-5 bg-gray-200 animate-pulse rounded" />
                                ))}
                            </div>
                        ))
                    ) : booking.filter((b) => b.bookingStatus === "await").length === 0 ? (
                        <div className="text-center py-8 text-gray-400">{t("no_data")}</div>
                    ) : (
                        booking
                            .filter((b) => b.bookingStatus === "await")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                                    className="grid grid-cols-6 gap-4 px-4 py-3 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">
                                            {t("approve_status")}
                                        </span>
                                        <span className="font-medium">{item?.car?.model}</span>
                                    </div>
                                    <div className="text-center">{item?.user?.username}</div>
                                    <div className="text-center">{item?.user?.phoneNumber}</div>
                                    <div className="text-center">{item?.car?.plateNumber}</div>
                                    <div className="text-center">{item?.time?.date}</div>
                                    <div className="text-center">{item?.time?.time}</div>
                                </div>
                            ))
                    )}
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-gray-200">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 space-y-2">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-4 bg-gray-200 animate-pulse rounded" />
                                ))}
                            </div>
                        ))
                    ) : booking.filter((b) => b.bookingStatus === "await").length === 0 ? (
                        <div className="text-center py-8 text-gray-400">{t("no_data")}</div>
                    ) : (
                        booking
                            .filter((b) => b.bookingStatus === "await")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">
                                            {t("approve_status")}
                                        </span>
                                        <span className="text-sm font-medium">{item?.car?.model}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("user")}:</span>
                                            <span className="text-gray-900">{item?.user?.username}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("phone")}:</span>
                                            <span className="text-gray-900">{item?.user?.phoneNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("plate")}:</span>
                                            <span className="text-gray-900">{item?.car?.plateNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("date")}:</span>
                                            <span className="text-gray-900">{item?.time?.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("time_label")}:</span>
                                            <span className="text-gray-900">{item?.time?.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
