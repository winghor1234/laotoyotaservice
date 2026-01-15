import { useState } from "react";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";


const EditZoneSchema = (t) => z.object({
    zoneName: z.string().min(1, t("min_length_1")),
    timeFix: z.string().min(1, t("min_length_1")),
});

export const useAddZoneForm = ({ onClose, fetchZone }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors }, } = useForm( { resolver: zodResolver(EditZoneSchema(t)), } );
    const [loading, setLoading] = useState(false);

    // 📌 submit form
    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_ZONE, data);
            SuccessAlert(t("add_success"));
            fetchZone();
            reset();
            onClose();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("Create zone failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };

}