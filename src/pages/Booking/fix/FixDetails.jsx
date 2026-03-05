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
    <div style={{ background: "#f3f4f6", padding: "40px 0" }}>

      {/* Top Action */}
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/user/booking/fix")}
          style={btnGray}
        >
          <FaArrowLeft /> {t("back")}
        </button>
      </div>

      {/* Paper */}
      <div
        style={{
          maxWidth: "850px",
          margin: "auto",
          background: "#ffffff",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          fontSize: "12pt",
          lineHeight: "1.7",
          color: "#111827",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {t("fix_details")}
        </h2>

        <hr style={{ marginBottom: "30px", borderColor: "#e5e7eb" }} />

        {/* Customer Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            gap: "30px",
          }}
        >
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "12px", color: "#374151" }}>
              {t("customer_info")}
            </h3>

            <p><strong>{t("customer_name")}:</strong> {fixData?.user?.username}</p>
            <p><strong>{t("customer_phone")}:</strong> {fixData?.user?.phoneNumber}</p>
          </div>

          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "12px", color: "#374151" }}>
              {t("car_info")}
            </h3>

            <p><strong>{t("plate_number")}:</strong> {fixData?.car?.plateNumber}</p>
            <p><strong>{t("engine_number")}:</strong> {fixData?.car?.engineNumber}</p>
            <p><strong>{t("frame_number")}:</strong> {fixData?.car?.frameNumber}</p>
            <p><strong>{t("car_model")}:</strong> {fixData?.car?.model}</p>
          </div>
        </div>

        <hr style={{ marginBottom: "30px", borderColor: "#e5e7eb" }} />

        {/* Appointment + Service */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            gap: "30px",
          }}
        >
          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "12px", color: "#374151" }}>
              {t("appointment_time")}
            </h3>

            <p><strong>{t("date_label")}:</strong> {fixData?.time?.date}</p>
            <p><strong>{t("time_label")}:</strong> {fixData?.time?.time}</p>
          </div>

          <div style={{ width: "48%" }}>
            <h3 style={{ marginBottom: "12px", color: "#374151" }}>
              {t("service_information")}
            </h3>

            {service?.length > 0 &&
              service?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <p>
                    <strong>{t("service_label")}:</strong> {item?.service?.serviceName}
                  </p>
                  <p>
                    <strong>{t("remark_label")}:</strong> {fixData?.remark}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <hr style={{ marginBottom: "30px", borderColor: "#e5e7eb" }} />

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() =>
              handleSubmit(fixData?.booking_id, fixData?.timeId)
            }
            style={btnGreen}
          >
            {t("complete_fix")}
          </button>
        </div>
      </div>

      {showPopup && (
        <PopupFix
          setShowPopup={setShowPopup}
          bookingId={bookingId}
          timeId={timeId}
        />
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
