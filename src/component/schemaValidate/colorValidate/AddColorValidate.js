import { useState } from "react";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";


const AddColorSchema = (t) => z.object({
    colorName: z.string().min(1, t("min_length_1")),
});

export const useAddColorForm = ({ onClose, fetchColor }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({ resolver: zodResolver(AddColorSchema(t)), });
    const [loading, setLoading] = useState(false);

    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_COLOR, data);
            SuccessAlert(t("add_success"));
            fetchColor();
            reset();
            onClose();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("Create color failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };

}
