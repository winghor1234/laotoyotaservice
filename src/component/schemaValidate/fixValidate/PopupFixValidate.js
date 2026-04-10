
// useFixForm.js
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
    fixCarPrice: z.coerce.number().min(1, t("min_length_1")),
    carPartPrice: z.coerce.number().min(1, t("min_length_1")),
    totalPrice: z.coerce.number().min(1, t("min_length_1")),
    totalPoint: z.coerce.number().min(1, t("min_length_1")).optional(),
  });

export const useFixForm = ({ bookingId }) => {

  const { t } = useTranslation("auth");
  const [fixes, setFixes] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(fixSchema(t)),
  });
  const fixCarPrice = Number(watch("fixCarPrice") || 0);
  const carPartPrice = Number(watch("carPartPrice") || 0);

  const fetchFix = async () => {
    try {
      const res = await axiosInstance.get(APIPath.SELECT_ALL_FIX);
      // console.log("fix: ", res);
      setFixes(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const totalPrice = fixCarPrice + carPartPrice;
    setValue("totalPrice", totalPrice);
    setValue("totalPoint", Math.floor(totalPrice / 10000));
  }, [fixCarPrice, carPartPrice, setValue]);

  useEffect(() => {
    fetchFix();
  }, []);

  const submitForm = async (data) => {
    try {
      const fixToUpdate = fixes.find((fix) => String(fix.bookingId) === String(bookingId))
      if (!fixToUpdate) {
        return
      }

      await axiosInstance.put(
        APIPath.UPDATE_FIX_STATUS(fixToUpdate.fix_id),
        {
          bookingId,
          kmLast: data.kmLast,
          kmNext: data.kmNext,
          detailFix: data.detailFix,
          fixCarPrice: data.fixCarPrice,
          carPartPrice: data.carPartPrice,
          totalPrice: data.totalPrice,
          totalPoint: data.totalPoint,
        }
      )
      SuccessAlert(t("fix_success"));
      navigate(`/user/billDetail/${fixToUpdate.fix_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return { register, handleSubmit, errors, submitForm, setValue, watch };
};
