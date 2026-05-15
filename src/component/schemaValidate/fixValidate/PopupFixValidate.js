
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
    labour_total: z.coerce.number().min(0),
    part_total: z.coerce.number().min(0),
    labour_point: z.coerce.number().optional(),
    part_point: z.coerce.number().optional(),
    totalPoint: z.coerce.number().optional(),
    total_price_lak: z.coerce.number().optional(),
    exchange_rate: z.coerce.number().optional(),
    payment_currency: z.string(),
    payment_type: z.string().min(1, "Please select payment type"),
    card_number: z.string().min(1, "Please select card"),
  });

export const useFixForm = ({ bookingId }) => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [fixes, setFixes] = useState([]);
  // const [cards, setCards] = useState([]);
  const [booking, setBooking] = useState({});
  const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({
    resolver: zodResolver(fixSchema(t)),
    defaultValues: {
      payment_currency: "LAK",
      exchange_rate: "",
      labour_total: 0,
      part_total: 0,
      labour_point: 0,
      part_point: 0,
      totalPoint: 0,
      total_price_lak: 0,
    }

  });


  // ================= WATCH =================

  const labour_total = Number(watch("labour_total")) || 0;
  const part_total = Number(watch("part_total")) || 0;
  const payment_currency = watch("payment_currency") || "LAK";
  const exchange_rate = Number(watch("exchange_rate")) || 1;

  // ================= FETCH =================

  const fetchData = async () => {
    try {
      const [fixRes, bookingRes, ] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_FIX_BY_BOOKING(bookingId)),
        // axiosInstance.get(APIPath.SELECT_ALL_CARD),
        axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId)),
      ]);
      setFixes(fixRes?.data?.data || []);
      // setCards(cardRes?.data?.data || []);
      setBooking(bookingRes?.data?.data || {});
    } catch (error) {
      console.log(error);
    }
  };

  const cards = booking?.user?.Card || [];



  // ================= CALCULATE =================

  useEffect(() => {
    const totalPrice = labour_total + part_total;
    let total_price_lak = totalPrice;
    let labour_total_lak = labour_total;
    let part_total_lak = part_total;

    // THB / USD convert to LAK

    if (
      payment_currency === "THB" ||
      payment_currency === "USD"
    ) {

      labour_total_lak = labour_total * exchange_rate;
      part_total_lak = part_total * exchange_rate;
      total_price_lak = totalPrice * exchange_rate;
    }

    // ================= POINT =================

    const labour_point = Math.floor(labour_total_lak / 10000);
    const part_point = Math.floor(part_total_lak / 10000);
    const totalPoint = labour_point + part_point;

    // ================= SET VALUE =================

    setValue("labour_point", labour_point);
    setValue("part_point", part_point);
    setValue("totalPoint", totalPoint);
    setValue("total_price_lak", total_price_lak);
    // reset exchange

    if (payment_currency === "LAK") {
      setValue("exchange_rate", "");
    }

  }, [
    labour_total,
    part_total,
    payment_currency,
    exchange_rate,
    setValue,
  ]);

  // ================= INIT =================

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SUBMIT =================
  const submitForm = async (data) => {
    try {
      const payload = {
        bookingId,
        kmLast: data.kmLast,
        kmNext: data.kmNext,
        detailFix: data.detailFix,
        labour_total:
          payment_currency === "LAK"
            ? Number(data.labour_total)
            : Math.floor(
              Number(data.labour_total) *
              Number(exchange_rate)
            ),

        part_total:
          payment_currency === "LAK"
            ? Number(data.part_total)
            : Math.floor(
              Number(data.part_total) *
              Number(exchange_rate)
            ),
        labour_point: data.labour_point,
        part_point: data.part_point,
        payment_type: data.payment_type,
        exchange_rate:
          payment_currency === "LAK"
            ? 0
            : data.exchange_rate,

        card_number: data.card_number,
      };

      await axiosInstance.put(
        APIPath.UPDATE_FIX_STATUS(fixes.fix_id), payload);
      await axiosInstance.put(APIPath.UPDATE_BOOKING_STATUS(bookingId),
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

  return { register, handleSubmit, errors, submitForm, setValue, watch, cards };
};