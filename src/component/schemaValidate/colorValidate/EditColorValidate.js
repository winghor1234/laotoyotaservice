import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const EditColorSchema = (t) => z.object({
    colorName: z.string().min(1, t("min_length_1")),
});


export const useEditColorForm = ({ colorId, fetchColor, onClose }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(EditColorSchema(t)), });
    const [loading, setLoading] = useState(false);
    const handleFetchColor = async () => {
        if (!colorId) return;
        const res = await axiosInstance.get(APIPath.SELECT_ONE_COLOR(colorId));
        const resData = res?.data?.data;
        if (resData) {
            reset({
                colorName: resData.colorName,
            });
        }
    };

    useEffect(() => {
        handleFetchColor();
    }, [colorId]);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.UPDATE_COLOR(colorId), data);
            SuccessAlert(t("update_success"));
            fetchColor();
            onClose();
            reset();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update color failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };

}
