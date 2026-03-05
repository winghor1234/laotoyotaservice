import { useEffect, useState } from "react";
import { FaArrowLeft, FaCar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import PopupFix from "./PopupFix";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FixDetails = () => {
  const { t } = useTranslation("booking");
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [fixData, setFixData] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [timeId, setTimeId] = useState("");
  const [service, setService] = useState([]);
  const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(id));
      setFixData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataDT = async () => {
    try {
      const serviceRes = await axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(id));
      setService(serviceRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = (bookingId, timeId) => {
    setShowPopup(true);
    setBookingId(bookingId);
    setTimeId(timeId);
  };

  useEffect(() => {
    fetchData();
    fetchDataDT();
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
            <p><strong>{t("customer_name")}:</strong> {fixData?.user?.username}</p>
            <p><strong>{t("customer_phone")}:</strong> {fixData?.user?.phoneNumber}</p>
          </div>

          {/* Right: Car + Appointment */}
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px", color: "#374151" }}>{t("car_info")}</h3>
            <p><strong>{t("plate_number")}:</strong> {fixData?.car?.plateNumber}</p>
            <p><strong>{t("engine_number")}:</strong> {fixData?.car?.engineNumber}</p>
            <p><strong>{t("frame_number")}:</strong> {fixData?.car?.frameNumber}</p>
            <p><strong>{t("car_model")}:</strong> {fixData?.car?.model}</p>

            <h3 style={{ margin: "15px 0 10px 0", fontSize: "16px", color: "#374151" }}>{t("appointment_time")}</h3>
            <p><strong>{t("date_label")}:</strong> {fixData?.time?.date}</p>
            <p><strong>{t("time_label")}:</strong> {fixData?.time?.time}</p>
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
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{fixData?.remark || "-"}</td>
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
          <button onClick={() => handleSubmit(fixData?.booking_id, fixData?.timeId)} style={btnGreen}>
            {t("complete_fix")}
          </button>
        </div>
      </div>

      {showPopup && (
        <PopupFix setShowPopup={setShowPopup} bookingId={bookingId} timeId={timeId} />
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
