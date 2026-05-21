import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import { useEffect } from "react";

// Schema
const cardSchema = (t) =>
    z.object({
        userId: z.string().min(1, { message: t("required"), }),
        card_number: z.string().min(2, { message: t("min_length_2") }),
        vip_number: z.string().min(1, { message: t("required") }),
        discount: z.coerce.number().min(0, { message: t("required"), }),
        card_type: z.string().max(1).optional(),
        goldIssued: z.coerce.date().optional(),
        received: z.string().max(1).optional(),
        issued_date: z.coerce.date().optional(),
        expiration_date: z.coerce.date().optional(),
        plate_number: z.string().max(10).optional(),
        vehicle_model: z.string().max(30).optional(),
        color: z.string().max(20).optional(),
        frame_number: z.string().max(30).optional(),
        engine_number: z.string().max(30).optional(),
        active_point: z.coerce.number().optional(),
        total_point: z.coerce.number().optional(),
        running_part: z.coerce.number().optional(),
        running_labour: z.coerce.number().optional(),
        countCard: z.coerce.number().optional(),

    });

export const useAddCardForm = ({ onClose, handleFetchCard, }) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const { t } = useTranslation("auth");
    const form = useForm({ resolver: zodResolver(cardSchema(t)), });
    const { register, handleSubmit, setValue, control, formState: { errors }, } = form;


    useEffect(() => {
        Promise.all([
            axiosInstance.get(APIPath.SELECT_ALL_USER),
        ])
            .then(([userRes]) => {
                const userData = userRes?.data?.data || [];
                setUsers(userData);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            })

    })
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(
                APIPath.CREATE_CARD,data
                // {
                //     userId: data.userId,
                //     card_number: data.card_number,
                //     vip_number: data.vip_number,
                //     discount: data.discount,
                // }
            );
            handleFetchCard();
            SuccessAlert(t("add_success"));
            onClose();
            // reset
            setValue("userId", "");
            setValue("customer_number", "");
            setValue("card_number", "");
            setValue("vip_number", "");
            setValue("discount", "");
            setValue("card_type", "");
            setValue("goldIssued", "");
            setValue("received", "");
            setValue("issued_date", "");
            setValue("expiration_date", "");
            setValue("plate_number", "");
            setValue("vehicle_model", "");
            setValue("color", "");
            setValue("frame_number", "");
            setValue("engine_number", "");
            setValue("active_point", "");
            setValue("total_point", "");
            setValue("running_part", "");
            setValue("running_labour", "");
            setValue("countCard", "");
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("create card failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, control, loading, onSubmit, formState: { errors }, users };
};