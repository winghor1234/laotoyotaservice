import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";



export const promotionSchema = (t) => z.object({
    title: z.string().min(2, { message: t("min_length_2") }),
    detail: z.string().min(2, { message: t("min_length_2") }),
    image: z.any().optional()
});


export const useEditPromotionForm = ({ onClose, promotionId, handleFetchPromotion }) => {
    const { t } = useTranslation("auth");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({ resolver: zodResolver(promotionSchema(t)) });
    const imageFile = watch("image");

    useEffect(() => {
        const fetchDataById = async () => {
            if (!promotionId) return;
            setLoading(true);
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_PROMOTION(promotionId));
                const data = res?.data?.data;
                reset({
                    title: data?.title || "",
                    detail: data?.detail || "",
                    image: data?.image || null
                });
            } catch (error) {
                console.error("Error fetching promotion:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataById();
    }, [promotionId]);

    const submitForm = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("detail", data.detail);
        if (data.image && data.image[0] instanceof File) {
            formData.append("image", data.image[0]);
        }

        try {
            await axiosInstance.put(APIPath.UPDATE_PROMOTION(promotionId), formData);
            handleFetchPromotion();
            SuccessAlert(t("update_success"));
            onClose();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update promotion failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return {register,handleSubmit,setValue,formState: { errors },imageFile,loading,submitForm}
}