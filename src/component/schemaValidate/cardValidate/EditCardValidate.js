import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Schema
export const cardSchema = (t) =>
    z.object({
        userId: z.string().min(1, {
            message: t("required"),
        }),

        // customer_number: z
        //     .string()
        //     .min(2, { message: t("min_length_2") }),

        card_number: z
            .string()
            .min(2, { message: t("min_length_2") }),

        vip_number: z
            .string()
            .min(1, { message: t("required") }),

        discount: z.coerce.number().min(0, {
            message: t("required"),
        }),
    });

export const useEditCardForm = ({ onClose, cardId, handleFetchCard, }) => {
    const { t } = useTranslation("auth");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, setValue, reset, control, formState: { errors }, } = useForm({ resolver: zodResolver(cardSchema(t)), });

    useEffect(() => {
        if (!cardId) return;
        setLoading(true);
        Promise.all([
            axiosInstance.get(APIPath.SELECT_ONE_CARD(cardId)),
            axiosInstance.get(APIPath.SELECT_ALL_USER),])
            .then(([cardRes, userRes]) => {
                const cardData = cardRes?.data?.data;
                const userData = userRes?.data?.data || [];
                setUsers(userData);
                reset({
                    userId: cardData?.userId || "",
                    // customer_number: cardData?.customer_number || "",
                    card_number: cardData?.card_number || "",
                    vip_number: cardData?.vip_number || "",
                    discount: cardData?.discount || 0,
                });
            })
            .catch((error) => {
                console.error("Error fetching card:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cardId]);

    // submit
    const submitForm = async (data) => {
        setLoading(true);

        try {
            await axiosInstance.put(
                APIPath.UPDATE_CARD(cardId),
                {
                    userId: data.userId,
                    customer_number: data.customer_number,
                    card_number: data.card_number,
                    vip_number: data.vip_number,
                    discount: data.discount,
                }
            );

            handleFetchCard();

            SuccessAlert(
                t("update_success")
            );

            onClose();
        } catch (error) {
            SuccessAlert(
                t("update_failed"),
                1500,
                "warning"
            );

            console.error(
                "Update card failed:",
                error.response?.data ||
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        loading,
        submitForm,
        control,
        users
    };
};