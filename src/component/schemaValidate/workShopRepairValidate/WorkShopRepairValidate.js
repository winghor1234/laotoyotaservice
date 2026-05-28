
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { useTranslation } from "react-i18next";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { usePoints } from "../../../utils/PointContext";

const workShopRepairSchema = (t) =>
  z.object({
    kmNext: z.coerce.number().min(1, t("min_length_1")),
    kmLast: z.coerce.number().min(1, t("min_length_1")),
    labour_total: z.coerce.number().min(0),
    part_total: z.coerce.number().min(0),
    labour_point: z.coerce.number().optional(),
    part_point: z.coerce.number().optional(),
    totalPoint: z.coerce.number().optional(),
    total_price_lak: z.coerce.number().optional(),
    exchange_rate: z.coerce.number().optional(),
    payment_currency: z.string(),
    payment_type: z.string().min(1, t("Please_select_payment_type")),
    cardId: z.string().min(1, t("Please_select_card")),
    discount: z.coerce.number().min(0).optional(),
    labour_discount: z.coerce.number().min(0).max(99).optional(),
    part_discount: z.coerce.number().min(0).max(99).optional(),
  });

export const useWorkShopRepair = ({ bookingId }) => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  // const [fixes, setFixes] = useState({});
  const [cards, setCards] = useState([]);

  const [isManualLabourPoint, setIsManualLabourPoint] = useState(false);
  const [isManualPartPoint, setIsManualPartPoint] = useState(false);

  // 🔥 store computed values (IMPORTANT FIX)
  const [calculated, setCalculated] = useState({
    labour: 0,
    part: 0,
    total: 0,
  });
  const { pointSettings } = usePoints();

  const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({
    resolver: zodResolver(workShopRepairSchema(t)),
    defaultValues: {
      payment_currency: "LAK",
      exchange_rate: "",
      labour_total: 0,
      part_total: 0,
      labour_point: 0,
      part_point: 0,
      totalPoint: 0,
      total_price_lak: 0,
      labour_discount: 0,
      part_discount: 0,
    },
  });
  // console.log("card", cards);

  // ================= WATCH =================
  const labour_total = Number(watch("labour_total")) || 0;
  const part_total = Number(watch("part_total")) || 0;
  const labour_point = Number(watch("labour_point")) || 0;
  const part_point = Number(watch("part_point")) || 0;

  const payment_currency = watch("payment_currency") || "LAK";
  const exchange_rate = Number(watch("exchange_rate")) || 1;

  const labour_discount = Number(watch("labour_discount")) || 0;
  const part_discount = Number(watch("part_discount")) || 0;

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [ cardRes] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_ALL_CARD),
        // axiosInstance.get(APIPath.SELECT_FIX_BY_BOOKING(bookingId)),
      ]);

      // setFixes(fixRes?.data?.data || {});
      setCards(cardRes?.data?.data || []);
      // console.log("fixes", fixRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const cards = booking?.user?.Card || [];

  // ================= CALCULATION (SOURCE OF TRUTH) =================
  useEffect(() => {
    let labour = labour_total;
    let part = part_total;

    if (payment_currency === "THB" || payment_currency === "USD") {
      labour *= exchange_rate;
      part *= exchange_rate;
    }

    const labourDiscount = labour * (labour_discount / 100);
    const partDiscount = part * (part_discount / 100);

    const finalLabour = Math.max(labour - labourDiscount, 0);
    const finalPart = Math.max(part - partDiscount, 0);


    const autoLabourPoint = pointSettings.labour_amount > 0
      ? Math.floor(finalLabour / pointSettings.labour_amount) * pointSettings.labour_point
      : 0;

    const autoPartPoint = pointSettings.part_amount > 0
      ? Math.floor(finalPart / pointSettings.part_amount) * pointSettings.part_point
      : 0;

    // const autoLabourPoint = Math.floor(finalLabour / 100000);
    // const autoPartPoint = Math.floor(finalPart / 50000);

    const labourPointFinal = isManualLabourPoint ? labour_point : autoLabourPoint;
    const partPointFinal = isManualPartPoint ? part_point : autoPartPoint;

    setValue("labour_point", labourPointFinal);
    setValue("part_point", partPointFinal);

    const totalPoint = labourPointFinal + partPointFinal;

    setValue("totalPoint", totalPoint);
    setValue("total_price_lak", finalLabour + finalPart);

    setCalculated({
      labour: finalLabour,
      part: finalPart,
      total: finalLabour + finalPart,
    });

    if (payment_currency === "LAK") {
      setValue("exchange_rate", "");
    }
  }, [
    labour_total,
    part_total,
    labour_discount,
    part_discount,
    labour_point,
    part_point,
    isManualLabourPoint,
    isManualPartPoint,
    payment_currency,
    exchange_rate,
    isManualLabourPoint,
    isManualPartPoint,
    pointSettings,
  ]);

  // ================= INIT =================
  useEffect(() => {
    fetchData();
  }, []);

  // ================= SUBMIT (USE ONLY STATE, NO RE-CALC) =================
  const submitForm = async (data) => {
    try {
      const payload = {
        bookingId,
        kmLast: data.kmLast,
        kmNext: data.kmNext,
        detailFix: data.detailFix,
        labour_total: calculated.labour,
        part_total: calculated.part,
        labour_point: data.labour_point,
        part_point: data.part_point,
        payment_type: data.payment_type,
        cardId: data.cardId,
        exchange_rate:
          payment_currency === "LAK"
            ? 0
            : data.exchange_rate,
      };

      await axiosInstance.put(
        APIPath.UPDATE_FIX_STATUS(fixes.fix_id),
        payload
      );

      await axiosInstance.put(
        APIPath.UPDATE_BOOKING_STATUS(bookingId),
        {
          bookingStatus: "success",
        }
      );

      SuccessAlert(t("fix_success"));

      navigate(`/user/billDetail/${fixes.fix_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    submitForm,
    setValue,
    watch,
    cards,
    setIsManualLabourPoint,
    setIsManualPartPoint,
  };
};