

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { useTranslation } from "react-i18next";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

const fixSchema = (t) =>
  z.object({
    kmNext: z.coerce.number().min(1, t("min_length_1")),
    kmLast: z.coerce.number().min(1, t("min_length_1")),
    detailFix: z.string().min(2, t("min_length_2")),
    fixCarPrice: z.coerce.number().min(1, t("min_length_1")), 
    carPartPrice: z.coerce.number().min(1, t("min_length_1")),
    totalPrice: z.coerce.number().min(1, t("min_length_1")),
  });

export const useFixForm = ({ bookingId, timeId }) => {
  const { t } = useTranslation("auth");
  const [fixes, setFixes] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({ resolver: zodResolver(fixSchema(t)),});
  const fixCarPrice = Number(watch("fixCarPrice") || 0);
  const carPartPrice = Number(watch("carPartPrice") || 0);

  const fetchFix = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ALL_FIX);
      setFixes(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isNaN(fixCarPrice) && !isNaN(carPartPrice)) {
      const total = fixCarPrice + carPartPrice;
      setValue("totalPrice", total);
    } else {
      setValue("totalPrice", 0);
    }
    fetchFix();
  }, [fixCarPrice, carPartPrice, setValue]);

  const submitForm = async (data) => {
    try {
      const fixToUpdate = fixes.find((fix) => fix.bookingId === bookingId);
      if (!fixToUpdate) return;

      const zoneId = fixToUpdate?.zoneId;

      const formData = new URLSearchParams({
        bookingId: bookingId,
        zoneId: zoneId,
        kmLast: String(data.kmLast),
        kmNext: String(data.kmNext),
        detailFix: data.detailFix,
        fixCarPrice: String(data.fixCarPrice),
        carPartPrice: String(data.carPartPrice),
        totalPrice: String(data.totalPrice),
      });
      await axiosInstance.put(APIPath.UPDATE_FIX_STATUS(fixToUpdate.fix_id), formData);
      await axiosInstance.put(APIPath.UPDATE_TIME_STATUS(timeId), { timeStatus: "true" });
      await axiosInstance.put(APIPath.UPDATE_ZONE_STATUS(fixToUpdate.zoneId), { zoneStatus: "true" });

      // ✅ แจ้งเตือนสำเร็จ
      SuccessAlert(t("fix_success"));
      // navigate(`/user/successDetail/${fixToUpdate.fix_id}`);
      navigate(`/user/billDetail/${fixToUpdate.fix_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return { register, handleSubmit, errors, submitForm };
};

