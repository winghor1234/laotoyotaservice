// utils/Booking.js
import APIPath from "../api/APIPath";
import axiosInstance from "./AxiosInstance";

export const getBookingByMonth = async () => {
  try {
    const res = await axiosInstance.get(APIPath.SELECT_ALL_BOOKING);
    const data = res?.data?.data || [];

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyBooking = months.map(month => ({ month, total: 0 }));

    data.forEach(item => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      monthlyBooking[monthIndex].total += 1; // นับจำนวน booking ต่อเดือน
    });

    const totalBooking = data.length;

    return { monthlyBooking, totalBooking };
  } catch (error) {
    console.error("Fetch Booking Error:", error);
    return { monthlyBooking: [], totalBooking: 0 };
  }
};
