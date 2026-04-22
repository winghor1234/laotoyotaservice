import { FaArrowLeft, FaCar } from "react-icons/fa";
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

  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [service, setService] = useState([]);
  // const [zone, setZone] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
        const fixData = fixRes?.data?.data;
        setData(fixData);

        const bookingIdFromFix = fixData?.bookingId;
        const zoneIdFromFix = fixData?.zoneId;

        if (bookingIdFromFix || zoneIdFromFix) {
          const [bookingRes, serviceRes] = await Promise.all([
            bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingIdFromFix)) : Promise.resolve(null),
            bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(bookingIdFromFix)) : Promise.resolve(null),
            zoneIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_ZONE(zoneIdFromFix)) : Promise.resolve(null),
          ]);

          if (bookingRes) setBooking(bookingRes?.data?.data);
          if (serviceRes) setService(serviceRes?.data?.data);
          // if (zoneRes) setZone(zoneRes?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [id]);

  return (
    <div style={{ background: "#f3f4f6", padding: "30px 0", fontFamily: "Arial, sans-serif", fontSize: "15px", lineHeight: "1.6", color: "#111827" }}>

      {/* Top Action */}
      <div style={{ maxWidth: "900px", margin: "0 auto 20px", display: "flex", justifyContent: "flex-start" }}>
        <button onClick={() => navigate("/user/booking/success")} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          background: "#e5e7eb",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
          transition: "0.2s",
        }}>
          <FaArrowLeft /> {t("back")}
        </button>
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>{t("title")}</h2>

      <div style={{ maxWidth: "900px", margin: "auto", background: "#ffffff", padding: "25px 30px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>

        {/* Customer + Car + Appointment */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "25px", marginBottom: "25px" }}>
          {/* Left: Customer */}
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("customer_info")}</h3>
            <p><strong>{t("customer_name")}:</strong> {booking?.user?.username}</p>
            <p><strong>{t("customer_phone")}:</strong> {booking?.user?.phoneNumber}</p>

            <h3 style={{ margin: "15px 0 10px 0", fontSize: "16px", color: "#374151" }}>{t("appointment_time")}</h3>
            <p><strong>{t("zone_label")}:</strong> {booking?.zone?.zoneName}</p>
            <p><strong>{t("branch_label")}:</strong> {booking?.branch?.branch_name}</p>
            <p><strong>{t("date_label")}:</strong> {formatDates(booking?.day)}</p>
            <p><strong>{t("time_label")}:</strong> {booking?.time?.time}</p>
          </div>

          {/* Right: Car + Appointment */}
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("car_info")}</h3>
            <p><strong>{t("plate_number")}:</strong> {booking?.car?.plateNumber}</p>
            <p><strong>{t("engine_number")}:</strong> {booking?.car?.engineNumber}</p>
            <p><strong>{t("frame_number")}:</strong> {booking?.car?.frameNumber}</p>
            <p><strong>{t("car_model")}:</strong> {booking?.car?.model}</p>
          </div>
        </div>

        {/* Services Table Section */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500", color: "#374151" }}>{t("service_information")}</h3>
          {service?.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>#</th>
                  <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{t("service_label")}</th>
                  <th style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{t("remark_label")}</th>
                </tr>
              </thead>
              <tbody>
                {service.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{item?.service?.serviceName}</td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{booking?.remark || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: "15px", color: "#6b7280" }}>{t("no_service")}</p>
          )}
        </div>

        {/* Price Table Section */}
        <div style={{ marginBottom: "0px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500", color: "#374151" }}>{t("price_information")}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{t("fixCarPrice")}</td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{FormatNumber(data?.fixCarPrice)} ກີບ</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{t("carPartPrice")}</td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{FormatNumber(data?.carPartPrice)} ກີບ</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "600", color: "#16a34a" }} colSpan={2} align="center">
                  {t("totalPrice")}: {FormatNumber(data?.totalPrice)} ກີບ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuccessDetail;
