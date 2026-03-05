import { FaArrowLeft, FaCar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const SuccessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("booking");

  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [service, setService] = useState([]);
  const [zone, setZone] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fixRes = await axiosInstance.get(APIPath.SELECT_ONE_FIX(id));
        const fixData = fixRes?.data?.data;
        setData(fixData);

        const bookingIdFromFix = fixData?.bookingId;
        const zoneIdFromFix = fixData?.zoneId;

        if (bookingIdFromFix || zoneIdFromFix) {
          const [bookingRes, serviceRes, zoneRes] = await Promise.all([
            bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingIdFromFix)) : Promise.resolve(null),
            bookingIdFromFix ? axiosInstance.get(APIPath.SELECT_BOOKING_DETAIL_BY(bookingIdFromFix)) : Promise.resolve(null),
            zoneIdFromFix ? axiosInstance.get(APIPath.SELECT_ONE_ZONE(zoneIdFromFix)) : Promise.resolve(null),
          ]);

          if (bookingRes) setBooking(bookingRes?.data?.data);
          if (serviceRes) setService(serviceRes?.data?.data);
          if (zoneRes) setZone(zoneRes?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [id]);

  return (
    <div style={{ background: "#f3f4f6", padding: "30px 0", fontFamily: "Arial, sans-serif", fontSize: "13px", lineHeight: "1.4", color: "#111827" }}>

      {/* Top Action */}
      <div style={{ maxWidth: "900px", margin: "0 auto 20px", display: "flex", justifyContent: "flex-start" }}>
        <button onClick={() => navigate("/user/booking/success")} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          background: "#e5e7eb",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
          transition: "0.2s",
        }}>
          <FaArrowLeft /> {t("back")}
        </button>
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", fontSize: "18px", fontWeight: "500", marginBottom: "15px" }}>{t("title")}</h2>

      <div style={{ maxWidth: "900px", margin: "auto", background: "#ffffff", padding: "20px 25px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>

        {/* Grid Info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: t("bookingInfo"), value: <FaCar className="inline-block text-gray-700" /> },
            { label: t("customerName"), value: booking?.user?.username },
            { label: t("phone"), value: booking?.user?.phoneNumber },
            { label: t("plateNumber"), value: booking?.car?.plateNumber },
            { label: t("frameNumber"), value: booking?.car?.frameNumber },
            { label: t("engineNumber"), value: booking?.car?.engineNumber },
            { label: t("carModel"), value: booking?.car?.model },
            { label: t("date_label"), value: booking?.time?.date },
            { label: t("time_label"), value: booking?.time?.time },
            { label: t("zone"), value: zone?.zoneName },
            { label: t("kmLast"), value: data?.kmLast },
            { label: t("kmNext"), value: data?.kmNext },
          ].map((item, index) => (
            <div key={index} style={{
              flex: "1 1 120px",
              background: "#f9fafb",
              borderRadius: "12px",
              textAlign: "center",
              padding: "10px",
            }}>
              <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>{item.value}</p>
            </div>
          ))}

          {/* Services */}
          {service?.map((item, index) => (
            <div key={index} style={{
              flex: "1 1 120px",
              background: "#f9fafb",
              borderRadius: "12px",
              textAlign: "center",
              padding: "10px",
            }}>
              <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>{t("detailFix")}</p>
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>{item?.service?.serviceName}</p>
            </div>
          ))}
        </div>

        {/* Price Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
          <div style={{ background: "#f3f4f6", padding: "10px 12px", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ margin: "2px 0" }}>{t("fixCarPrice")}: {data?.fixCarPrice} ກີບ</p>
            <p style={{ margin: "2px 0" }}>{t("carPartPrice")}: {data?.carPartPrice} ກີບ</p>
          </div>
          <div style={{ background: "#f3f4f6", padding: "10px 12px", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontWeight: "600", color: "#16a34a", fontSize: "16px" }}>{t("totalPrice")}: {data?.totalPrice} ກີບ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDetail;
