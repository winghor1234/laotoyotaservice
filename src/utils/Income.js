// utils/Incomes.js
// import axiosInstance from "./AxiosInstance";
import APIPath from "../api/APIPath";
// import { useTranslation } from "react-i18next";

// export const useIncomesTranslation = () => {
//   const { t } = useTranslation("util");
//   return t;
// };

// export const getIncomes = async () => {
// //   const t = useIncomesTranslation();
//   try {
//     const res = await axiosInstance.get(APIPath.SELECT_ALL_FIX);
//     const data = res?.data?.data || [];

//     const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     const monthlyData = months.map(month => ({ name: month, value: 0 }));

//     data.forEach(item => {
//       const date = new Date(item.createdAt);
//       const monthIndex = date.getMonth();
//       monthlyData[monthIndex].value += item.totalPrice;
//     });

//     const totalPrice = data.reduce((sum, item) => sum + item.totalPrice, 0);

//     return { monthlyData, totalPrice };
//   } catch (error) {
//     console.error("Fetch Incomes Error:", error);
//     return { monthlyData: [], totalPrice: 0 };
//   }
// };


// ✅ ບໍ່ async ແລ້ວ, ຮັບ data ສຳເລັດຮູບ
export const getIncomes = (data = []) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData = months.map(month => ({ name: month, value: 0 }));

    data.forEach(item => {
        const date = new Date(item.createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].value += item.totalPrice;
    });

    const totalPrice = data.reduce((sum, item) => sum + item.totalPrice, 0);

    return { monthlyData, totalPrice };
};


// นับผู้ใช้เดือนนี้และเดือนก่อนหน้า
export const countUsersByMonth = (users) => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  let thisMonthCount = 0;
  let lastMonthCount = 0;

  users.forEach(user => {
    const created = new Date(user.createdAt);
    if (created.getFullYear() === thisYear && created.getMonth() === thisMonth) {
      thisMonthCount++;
    }
    if (created.getFullYear() === lastMonthYear && created.getMonth() === lastMonth) {
      lastMonthCount++;
    }
  });

  return { thisMonthCount, lastMonthCount };
};

// คำนวณเปอร์เซ็นต์เพิ่มขึ้น
export const calculatePercentIncrease = (thisMonth, lastMonth) => {
  if (lastMonth === 0) return 100;
  return ((thisMonth - lastMonth) / lastMonth) * 100;
};


