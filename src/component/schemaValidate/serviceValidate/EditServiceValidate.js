import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useState } from "react";
import { useTranslation } from "react-i18next";



const EditServiceSchema = (t) => z.object({
    serviceName: z.string().min(1, t("min_length_1")),
    description: z.string().min(1, t("min_length_1")),
    image: z.any().optional(),
});


export const useServiceEditForm = ({ serviceId, onClose, handleFetch }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({ resolver: zodResolver(EditServiceSchema(t)) });
    const imageFile = watch("image");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDataById = async () => {
            if (!serviceId) return;
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_SERVICE(serviceId));
                const data = res?.data?.data;
                reset({
                    serviceName: data.serviceName || "",
                    description: data.description || "",
                    image: data.image || null,
                });
            } catch (error) {
                console.error("Error fetching service:", error);
            }
        };
        fetchDataById();
    }, [serviceId]);

    const submitForm = async (data) => {
        setLoading(true);
        const dataForm = new FormData();
        dataForm.append("serviceName", data.serviceName);
        dataForm.append("description", data.description);
        if (data.image instanceof File) {
            dataForm.append("image", data.image);
        }

        try {
            await axiosInstance.put(APIPath.UPDATE_SERVICE(serviceId), dataForm);
            SuccessAlert(t("update_success"));
            handleFetch();
            reset();
            onClose();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update service failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, setValue, formState: { errors }, imageFile, loading, submitForm };

}