// import { FaArrowLeft, FaCar } from "react-icons/fa";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axiosInstance from "../../../utils/AxiosInstance";
// import APIPath from "../../../api/APIPath";
// import { useTranslation } from "react-i18next";
// import { formatDates } from "../../../utils/FormatDate";
// import { FormatNumber } from "../../../utils/FormatNumber";

// const SuccessDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation("booking");

//   const [data, setData] = useState([]);
//   const [booking, setBooking] = useState([]);
//   const [service, setService] = useState([]);
//   // const [zone, setZone] = useState([]);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
//         const fixData = fixRes?.data?.data;
//         setData(fixData);

//         const bookingIdFromFix = fixData?.bookingId;
//         const zoneIdFromFix = fixData?.zoneId;

//         if (bookingIdFromFix || zoneIdFromFix) {
//           const [bookingRes, serviceRes] = await Promise.all([
//             bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingIdFromFix)) : Promise.resolve(null),
//             bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(bookingIdFromFix)) : Promise.resolve(null),
//             zoneIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_ZONE(zoneIdFromFix)) : Promise.resolve(null),
//           ]);

//           if (bookingRes) setBooking(bookingRes?.data?.data);
//           if (serviceRes) setService(serviceRes?.data?.data);
//           // if (zoneRes) setZone(zoneRes?.data?.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchAllData();
//   }, [id]);

//   return (
//     <div style={{ background: "#f3f4f6", padding: "30px 0", fontFamily: "Arial, sans-serif", fontSize: "15px", lineHeight: "1.6", color: "#111827" }}>

//       {/* Top Action */}
//       <div style={{ maxWidth: "900px", margin: "0 auto 20px", display: "flex", justifyContent: "flex-start" }}>
//         <button onClick={() => navigate("/user/booking/success")} style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "6px",
//           padding: "8px 14px",
//           background: "#e5e7eb",
//           borderRadius: "12px",
//           cursor: "pointer",
//           fontSize: "15px",
//           fontWeight: "500",
//           transition: "0.2s",
//         }}>
//           <FaArrowLeft /> {t("back")}
//         </button>
//       </div>

//       {/* Title */}
//       <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>{t("title")}</h2>

//       <div style={{ maxWidth: "900px", margin: "auto", background: "#ffffff", padding: "25px 30px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>

//         {/* Customer + Car + Appointment */}
//         <div style={{ display: "flex", justifyContent: "space-between", gap: "25px", marginBottom: "25px" }}>
//           {/* Left: Customer */}
//           <div style={{ width: "48%" }}>
//             <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("customer_info")}</h3>
//             <p><strong>{t("customer_name")}:</strong> {booking?.user?.username}</p>
//             <p><strong>{t("customer_phone")}:</strong> {booking?.user?.phoneNumber}</p>

//             <h3 style={{ margin: "15px 0 10px 0", fontSize: "16px", color: "#374151" }}>{t("appointment_time")}</h3>
//             <p><strong>{t("zone_label")}:</strong> {booking?.zone?.zoneName}</p>
//             <p><strong>{t("branch_label")}:</strong> {booking?.branch?.branch_name}</p>
//             <p><strong>{t("date_label")}:</strong> {formatDates(booking?.day)}</p>
//             <p><strong>{t("time_label")}:</strong> {booking?.time?.time}</p>
//           </div>

//           {/* Right: Car + Appointment */}
//           <div style={{ width: "48%" }}>
//             <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("car_info")}</h3>
//             <p><strong>{t("plate_number")}:</strong> {booking?.car?.plateNumber}</p>
//             <p><strong>{t("engine_number")}:</strong> {booking?.car?.engineNumber}</p>
//             <p><strong>{t("frame_number")}:</strong> {booking?.car?.frameNumber}</p>
//             <p><strong>{t("car_model")}:</strong> {booking?.car?.model}</p>
//           </div>
//         </div>

//         {/* Services Table Section */}
//         <div style={{ marginBottom: "25px" }}>
//           <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500", color: "#374151" }}>{t("service_information")}</h3>
//           {service?.length > 0 ? (
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#f3f4f6" }}>
//                   <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>#</th>
//                   <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{t("service_label")}</th>
//                   <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{t("remark_label")}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {service.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{index + 1}</td>
//                     <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{item?.service?.serviceName}</td>
//                     <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{booking?.remark || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={{ fontSize: "15px", color: "#6b7280" }}>{t("no_service")}</p>
//           )}
//         </div>

//         {/* Price Table Section */}
//         <div style={{ marginBottom: "0px" }}>
//           <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500", color: "#374151" }}>{t("price_information")}</h3>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
//             <tbody>
//               <tr>
//                 <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{t("fixCarPrice")}</td>
//                 <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{FormatNumber(data?.labour_total)} ກີບ</td>
//               </tr>
//               <tr>
//                 <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{t("carPartPrice")}</td>
//                 <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{FormatNumber(data?.part_total)} ກີບ</td>
//               </tr>
//               <tr>
//                 <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "600", color: "#16a34a" }} colSpan={2} align="center">
//                   {t("totalPrice")}: {FormatNumber(data?.labour_total + data?.part_total)} ກີບ
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessDetail;



import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import { formatDates } from "../../../utils/FormatDate";
import { FormatNumber } from "../../../utils/FormatNumber";

const SuccessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("booking");

  const [data, setData] = useState(null);
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
        const fixData = fixRes?.data?.data;
        setData(fixData);

        const bookingId = fixData?.bookingId;

        if (bookingId) {
          const [bookingRes, serviceRes] = await Promise.all([
            axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId)),
            axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(bookingId)),
          ]);

          if (bookingRes) setBooking(bookingRes?.data?.data);
          if (serviceRes) setService(serviceRes?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAllData();
  }, [id]);

  if (loading) return <div className="flex justify-center p-10 text-red-600">{t("loading")}...</div>;

  const totalPrice = (data?.labour_total || 0) + (data?.part_total || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Top Action */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate("/user/booking/success")}
          className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
        >
          <FaArrowLeft size={12} /> {t("back")}
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-red-600 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-red-600 text-white text-center">
          <h2 className="text-lg font-normal tracking-wide">{t("title")}</h2>
        </div>

        <div className="p-6 sm:p-8">
          {/* Main Info Grid: Customer | Car | Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-gray-100 pb-8">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                {t("customer_info")}
              </h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p className="flex justify-between md:block">
                  <span className="text-gray-400 block md:mb-1">{t("customer_name")}:</span>
                  <span>{booking?.user?.username || "-"}</span>
                </p>
                <p className="flex justify-between md:block">
                  <span className="text-gray-400 block md:mb-1">{t("customer_phone")}:</span>
                  <span>{booking?.user?.phoneNumber || "-"}</span>
                </p>
              </div>
            </div>

            {/* Car Info */}
            <div className="space-y-3">
              <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                {t("car_info")}
              </h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p className="flex justify-between md:block">
                  <span className="text-gray-400 block md:mb-1">{t("plate_number")}:</span>
                  <span>{booking?.car?.plateNumber || "-"}</span>
                </p>
                <p className="flex justify-between md:block text-xs">
                  <span className="text-gray-400 block md:mb-1">{t("car_model")}:</span>
                  <span className="truncate block">{booking?.car?.model || "-"}</span>
                </p>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="space-y-3">
              <h3 className="text-sm text-red-600 uppercase tracking-wider border-l-2 border-red-600 pl-2 mb-4 font-normal">
                {t("appointment_time")}
              </h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p className="flex justify-between md:block">
                  <span className="text-gray-400 block md:mb-1">{t("date_label")}:</span>
                  <span className="text-red-600">{formatDates(booking?.day)}</span>
                </p>
                <p className="flex justify-between md:block">
                  <span className="text-gray-400 block md:mb-1">{t("branch_label")}:</span>
                  <span>{booking?.branch?.branch_name || "-"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-10">
            <h3 className="text-sm text-gray-900 mb-4 flex items-center gap-2 font-normal">
              <span className="w-1 h-4 bg-red-600"></span>
              {t("service_information")}
            </h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="p-3 w-12 text-center font-normal">#</th>
                    <th className="p-3 font-normal">{t("service_label")}</th>
                    <th className="p-3 font-normal">{t("remark_label")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {service.length > 0 ? (
                    service.map((item, index) => (
                      <tr key={index} className="hover:bg-red-50/20 transition-colors">
                        <td className="p-3 text-center text-red-600">{index + 1}</td>
                        <td className="p-3">{item?.service?.serviceName}</td>
                        <td className="p-3 text-gray-500">{booking?.remark || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-6 text-center text-gray-400">{t("no_service")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border border-red-600 p-5 rounded-xl bg-white">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-500 font-normal">
                <span>{t("fixCarPrice")}</span>
                <span className="font-mono text-gray-800">{FormatNumber(data?.labour_total)} ກີບ</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 border-b border-gray-100 pb-3 font-normal">
                <span>{t("carPartPrice")}</span>
                <span className="font-mono text-gray-800">{FormatNumber(data?.part_total)} ກີບ</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-red-600 uppercase tracking-tight font-normal">{t("totalPrice")}</span>
                <div className="text-right">
                  <span className="text-2xl text-red-600 font-mono font-normal">
                    {FormatNumber(totalPrice)}
                  </span>
                  <span className="ml-1.5 text-red-600 font-normal">ກີບ</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuccessDetail;