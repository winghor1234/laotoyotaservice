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
                APIPath.CREATE_CARD,
                {
                    userId: data.userId,
                    card_number: data.card_number,
                    vip_number: data.vip_number,
                    discount: data.discount,
                }
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
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("create card failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, control, loading, onSubmit, formState: { errors }, users };
};