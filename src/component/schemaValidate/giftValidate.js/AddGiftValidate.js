import {  useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const addGiftSchema = (t) => z.object({
    name: z.string().min(1, t("min_length_1")),
    point: z.string().min(1, t("min_length_1")),
    amount: z.string().min(1, t("min_length_1")),
    image: z.any().optional(),
});

export const useAddGiftForm = ({ onClose, handleFetch,  }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, formState: { errors }, setValue, control} = useForm({ resolver: zodResolver(addGiftSchema(t)), });
    const [loading, setLoading] = useState(false);

    const submitForm = async (data) => {
        setLoading(true);
        try {
            const dataForm = new FormData();
            dataForm.append("name", data.name);
            dataForm.append("amount", data.amount);
            dataForm.append("point", data.point);
            if (data.image && data.image[0] instanceof File) {
                dataForm.append("files", data.image[0]);
            }
            await axiosInstance.post(APIPath.CREATE_GIFT, dataForm);
            handleFetch();
            onClose();
            setValue("name", "");
            setValue("point", "");
            setValue("amount", "");
            setValue("image", null);
            SuccessAlert(t("add_success"))
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("Error adding gift:", error);
        } finally {
            setLoading(false);
        }
    };
    return { register, handleSubmit, loading,formState: { errors }, submitForm, control};
};

