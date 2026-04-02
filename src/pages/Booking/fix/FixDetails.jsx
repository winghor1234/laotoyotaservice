import { useEffect, useState } from "react";
import { FaArrowLeft, FaCar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import PopupFix from "./PopupFix";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatDates } from "../../../utils/FormatDate";

const FixDetails = () => {
  const { t } = useTranslation("booking");
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [booking, setBooking] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [timeId, setTimeId] = useState("");
  const [service, setService] = useState([]);
  const [timeFix, setTimeFix] = useState([]);
  const navigate = useNavigate();


  const fetchBooking = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
      setBooking(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBooingDetail = async () => {
    try {
      const serviceRes = await axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(id));
      setService(serviceRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTimeFix = async () => {
    try {
      const timeFixRes = await axiosInstance.get(APIPath.SELECT_ALL_TIME_FIX);
      setTimeFix(timeFixRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const timeIdInBooking = booking?.timeId;
  const selectedTimeFix = timeFix.find((time) => time?.timeId === timeIdInBooking);
  const zoneName = selectedTimeFix?.zone?.zoneName;
  const zoneId = selectedTimeFix?.zoneId;




  const handleSubmit = (bookingId, timeId) => {
    setShowPopup(true);
    setBookingId(bookingId);
    setTimeId(timeId);
  };

  useEffect(() => {
    fetchBooking();
    fetchBooingDetail();
    fetchTimeFix();
  }, []);

  return (
    <div style={{ background: "#f3f4f6", padding: "30px 0", fontFamily: "Arial, sans-serif", fontSize: "15px", lineHeight: "1.6", color: "#111827" }}>

      {/* Top Action */}
      <div style={{ maxWidth: "900px", margin: "0 auto 25px", display: "flex", justifyContent: "flex-start" }}>
        <button onClick={() => navigate("/user/booking/fix")} style={btnGray}>
          <FaArrowLeft /> {t("back")}
        </button>
      </div>

      {/* Paper */}
      <div style={{
        maxWidth: "900px",
        margin: "auto",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "25px", fontWeight: "600", fontSize: "18px" }}>
          {t("fix_details")}
        </h1>

        <hr style={{ marginBottom: "25px", borderColor: "#e5e7eb" }} />

        {/* Customer + Car + Appointment */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "25px", marginBottom: "25px" }}>
          {/* Left: Customer */}
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("customer_info")}</h3>
            <p><strong>{t("customer_name")}:</strong> {booking?.user?.username}</p>
            <p><strong>{t("customer_phone")}:</strong> {booking?.user?.phoneNumber}</p>

            <h3 style={{ margin: "15px 0 10px 0", fontSize: "16px", color: "#374151" }}>{t("appointment_time")}</h3>
            <p><strong>{t("zone_label")}:</strong> {zoneName}</p>
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

        <hr style={{ marginBottom: "25px", borderColor: "#e5e7eb" }} />

        {/* Service Table */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", color: "#374151" }}>{t("service_information")}</h3>
          {service?.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
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

        <hr style={{ marginBottom: "25px", borderColor: "#e5e7eb" }} />

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => handleSubmit(booking?.booking_id, booking?.timeId)} style={btnGreen}>
            {t("complete_fix")}
          </button>
        </div>
      </div>

      {showPopup && (
        <PopupFix setShowPopup={setShowPopup} bookingId={bookingId} timeId={timeId} zoneId={zoneId} />
      )}
    </div>
  );
};

const btnGray = {
  background: "#e5e7eb",
  padding: "8px 16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};

export default FixDetails;
