import {  useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const addGiftSchema = (t) => z.object({
    gift_Name: z.string().min(1, t("min_length_1")),
    gift_Point: z.string().min(1, t("min_length_1")),
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
            dataForm.append("gift_Name", data.gift_Name);
            dataForm.append("amount", data.amount);
            dataForm.append("gift_Point", data.gift_Point);
            if (data.image && data.image[0] instanceof File) {
                dataForm.append("files", data.image[0]);
            }
            await axiosInstance.post(APIPath.CREATE_GIFT, dataForm);
            handleFetch();
            onClose();
            setValue("gift_Name", "");
            setValue("gift_Point", "");
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

