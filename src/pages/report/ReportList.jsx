import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { useTranslation } from "react-i18next";
import { getBookingByMonth } from "../../utils/bookingCount";
import { getIncomes } from "../../utils/Income";
import { FormatNumber } from "../../utils/FormatNumber";
import ExcelExportButton from "../../utils/ExcelExportButton";


const ReportList = () => {
  const { t } = useTranslation("report");
  const [users, setUsers] = useState([]);
  const [booking, setBooking] = useState([]);
  const [fix, setFix] = useState([]);
  const [car, setCar] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [bookingByMonth, setBookingByMonth] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);


  const fetchReportData = async () => {
    try {
      const [userRes, bookingRes, fixRes, carRes] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_ALL_USER),
        axiosInstance.get(APIPath.SELECT_ALL_BOOKING),
        axiosInstance.get(APIPath.SELECT_ALL_FIX),
        axiosInstance.get(APIPath.SELECT_ALL_CAR),
      ]);
      const { monthlyData, totalPrice } = await getIncomes();
      const { monthlyBooking, totalBooking } = await getBookingByMonth();

      setUsers(userRes?.data?.data || []);
      setBooking(bookingRes?.data?.data || []);
      setFix(fixRes?.data?.data || []);
      setCar(carRes?.data?.data || []);
      setMonthlyIncomes(monthlyData);
      setTotalIncomes(totalPrice);
      setBookingByMonth(monthlyBooking);
      setTotalBookings(totalBooking);

    } catch (error) {
      console.error("❌ Fetch Report Data Error:", error);
    }
  };


  useEffect(() => {
    fetchReportData();
  }, []);

  // const bookingByMonth = [
  //   { month: "Jan", total: 20 },
  //   { month: "Feb", total: 15 },
  //   { month: "Mar", total: 30 },
  //   { month: "Apr", total: 25 },
  //   { month: "May", total: 40 },
  //   { month: "Jun", total: 35 },
  // ];

  // const fixRevenue = [
  //   { month: "Jan", revenue: 1000 },
  //   { month: "Feb", revenue: 1800 },
  //   { month: "Mar", revenue: 1200 },
  //   { month: "Apr", revenue: 2200 },
  //   { month: "May", revenue: 2600 },
  //   { month: "Jun", revenue: 1500 },
  // ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4">{t("report_title")}</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">{t("users")}</p>
          <h2 className="text-xl font-bold">{users.filter(user => user.role !== "admin").length}</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">{t("booking")}</p>
          <h2 className="text-xl font-bold">{booking.length}</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">{t("fix_service")}</p>
          <h2 className="text-xl font-bold">{fix.length}</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">{t("cars")}</p>
          <h2 className="text-xl font-bold">{car.length}</h2>
        </div>
      </div>

      {/* Booking Report */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium mb-2">{t("booking_by_month")}</h2>
          <ExcelExportButton data={bookingByMonth} fileName="BookingReport.xlsx" />
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={bookingByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#E52020" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-right text-green-500 font-semibold">
          {t("booking_count")} : {totalBookings.toLocaleString()} {t("times_count")}
        </div>
      </div>

      {/* Revenue Report */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">{t("fix_revenue")}</h2>
          <ExcelExportButton data={monthlyIncomes} fileName="FixRevenueReport.xlsx" />
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <AreaChart data={monthlyIncomes}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E52020" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E52020" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name"  />
              <YAxis tickFormatter={FormatNumber} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => FormatNumber(value)} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E52020"
                strokeWidth={2}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-right text-green-500 font-semibold">
          {t("total_income")} : {FormatNumber(totalIncomes)} {t("currency")}
        </div>
      </div>
    </div>
  );
};

export default ReportList;
