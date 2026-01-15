import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { Users, Clock3, Car, Gift } from "lucide-react";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LiaGiftsSolid } from "react-icons/lia";
import { GrUserAdmin } from "react-icons/gr";
import { FaChartLine } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import { calculatePercentIncrease, countUsersByMonth, getIncomes } from "../../utils/Income";
import { FormatNumber } from "../../utils/FormatNumber";



// const dataCircle = [
//     { name: "Complete", value: 40 },
//     { name: "Remaining", value: 100 }
// ];
const COLORS = ["#E52020", "#F0F0F0"];

// const dataLine = [
//     { name: "Jan", value: 50 }, { name: "Feb", value: 900 }, { name: "Mar", value: 300 },
//     { name: "Apr", value: 200 }, { name: "May", value: 100 }, { name: "Jun", value: 250 },
//     { name: "Jul", value: 50 }, { name: "Aug", value: 400 }, { name: "Sep", value: 500 },
//     { name: "Oct", value: 300 }, { name: "Nov", value: 400 }, { name: "Dec", value: 500 }
// ];

const Dashboard = () => {
    const { t } = useTranslation("dashboard");
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [booking, setBooking] = useState([]);
    // const [fix, setFix] = useState([]);
    const [car, setCar] = useState([]);
    const [gift, setGift] = useState([]);
    const [time, setTime] = useState([]);
    const [zone, setZone] = useState([]);
    const [service, setService] = useState([]);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    const [percentUserIncrease, setPercentUserIncrease] = useState(0);


    // const [monthlyData, setMonthlyData] = useState([]);

    const fetchData = async () => {
        try {
            const [userRes, promoRes, bookingRes, carRes, giftRes, timeRes, zoneRes, serviceRes] = await Promise.all([
                axiosInstance.get(APIPath.SELECT_ALL_USER),
                axiosInstance.get(APIPath.SELECT_ALL_PROMOTION),
                axiosInstance.get(APIPath.SELECT_ALL_BOOKING),
                axiosInstance.get(APIPath.SELECT_ALL_CAR),
                axiosInstance.get(APIPath.SELECT_ALL_GIFT),
                axiosInstance.get(APIPath.SELECT_ALL_TIME),
                axiosInstance.get(APIPath.SELECT_ALL_ZONE),
                axiosInstance.get(APIPath.SELECT_ALL_SERVICE),
                // axiosInstance.get(APIPath.SELECT_ALL_FIX),
            ]);
            const { monthlyData, totalPrice } = await getIncomes();

            setUsers(userRes?.data?.data || []);
            setPromotions(promoRes?.data?.data || []);
            setBooking(bookingRes?.data?.data || []);
            // setFix(fixRes?.data?.data || []);
            setCar(carRes?.data?.data || []);
            setGift(giftRes?.data?.data || []);
            setTime(timeRes?.data?.data || []);
            setZone(zoneRes?.data?.data || []);
            setService(serviceRes?.data?.data || []);
            setMonthlyIncomes(monthlyData);
            setTotalIncomes(totalPrice);

            const { thisMonthCount, lastMonthCount } = countUsersByMonth(users);
            const percent = calculatePercentIncrease(thisMonthCount, lastMonthCount);
            setPercentUserIncrease(percent);
        } catch (error) {
            console.error("Fetch Dashboard Data Error:", error);
        }
    };


    const handleApprove = (bookingId, timeId) => {
        navigate(`/user/receiverCarDetail/${bookingId}?time=${timeId}`);
    };

    useEffect(() => {
        fetchData();
        
    }, []);
    console.log("service data", service);
    // console.log("promotion data", promotions.length);
    // console.log("booking data", booking.length);
    // console.log("car data", car);
    console.log("gift data", gift);
    // console.log("time data", time);
    // console.log("zone data", zone);
    // console.log("user data", users);


    // PieChart data
    const dataCircle = [
        { name: "Increase", value: percentUserIncrease },
        { name: "Rest", value: 100 - percentUserIncrease }
    ];

    const dashboardItems = [
        { title: t("customer_info"), path: "/user/user", value: users.filter(user => user.role !== "admin").length, icon: <Users className="w-10 h-10 text-red-600" /> },
        // { title: t("service_total"), path: "#", value: "1420", icon: <FaChartLine className="w-10 h-10 text-red-600" /> },
        { title: t("promotion_info"), path: "/user/promotion", value: promotions.length, icon: <Gift className="w-10 h-10 text-red-600" /> },
        { title: t("gift"), path: "/user/gift", value: gift.length, icon: <LiaGiftsSolid className="w-10 h-10 text-red-600" /> },
        { title: t("car_info"), path: "/user/car", value: car.length, icon: <Car className="w-10 h-10 text-red-600" /> },
        { title: t("servicing_info"), path: "/user/servicing", value: service.length, icon: <HiOutlineWrenchScrewdriver className="w-10 h-10 text-red-600" /> },
        { title: t("zone_time"), path: "/user/time-zone", value: `${zone.length}/${time.length}`, icon: <Clock3 className="w-10 h-10 text-red-600" /> },
        { title: t("user_permission"), path: "/user/admin", value: users.filter(user => user.role === "admin").length, icon: <GrUserAdmin className="w-10 h-10 text-red-600" /> },
    ];

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dashboardItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-4 hover:shadow-2xl transition cursor-pointer"
                    >
                        {item.icon}
                        <p className="mt-2 text-md font-medium text-center">{item.title}</p>
                        <h1 className="text-xl font-bold mt-1">{item.value}</h1>
                    </Link>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {/* Pie Chart */}
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                    <h2 className="text-lg font-medium mb-2 text-center">{t("all_users")}</h2>
                    <div className="w-40 h-40">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={dataCircle} dataKey="value" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                    {dataCircle.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx]} />
                                    ))}
                                </Pie>
                                <text  x="50%"  y="50%"  textAnchor="middle"  dominantBaseline="middle"  fontWeight="bold"  fill="black" >
                                    {Math.round(percentUserIncrease)}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-red-600 mt-2 text-center">{t("monthly_user", { count: users.length })} {percentUserIncrease}%</p>
                </div>

                {/* Area Chart */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">{t("income")}</h2>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-2xl text-sm">{t("view_history")}</button>
                    </div>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyIncomes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E52020" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#E52020" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={FormatNumber} domain={[0, 500]} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(value) => FormatNumber(value)} contentStyle={{ backgroundColor: '#fff', border: '1px solid #E52020', borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="value" stroke="#E52020" fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-right text-green-500 font-semibold">
                        {t("total_income")} : {FormatNumber(totalIncomes)} {t("currency")}
                    </div>
                </div>
            </div>

            {/* Booking Table */}
            <h2 className="text-lg font-medium mt-6 mb-2">{t("latest_booking")}</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                {/* Desktop */}
                <div className="hidden md:block divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {booking.filter(b => b.bookingStatus === "await").map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                            className="grid grid-cols-6 gap-4 px-4 py-3 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">{t("approve_status")}</span>
                                <span className="font-medium">{item?.car?.model}</span>
                            </div>
                            <div className="text-center">{item?.user?.username}</div>
                            <div className="text-center">{item?.user?.phoneNumber}</div>
                            <div className="text-center">{item?.car?.plateNumber}</div>
                            <div className="text-center">{item?.time?.date}</div>
                            <div className="text-center">{item?.time?.time}</div>
                        </div>
                    ))}
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-gray-200">
                    {booking.filter(b => b.bookingStatus === "await").map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleApprove(item?.booking_id, item?.time?.time_id)}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between mb-2">
                                <span className="bg-yellow-500 px-3 py-1 text-black rounded-xl text-xs font-semibold">{t("approve_status")}</span>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
