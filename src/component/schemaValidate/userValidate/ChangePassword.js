import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { z } from "zod"; // ✅ ถูกต้อง
const schema = (t) => z.object({
    newPassword: z.string().min(6, t("min_length_6")),
    confirmPassword: z.string().min(6, t("min_length_6")),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "ລະຫັດຜ່ານບໍ່ກົງກັນ",
    path: ["confirmPassword"],
});

export const useChangePasswordForm = ({ customerId, onClose, handleFetch }) => {
    const { t } = useTranslation("user");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema(t)),
    });

    const submitForm = async (data) => {
        try {
            await axiosInstance.put(APIPath.CHANGE_CUSTOMER_PASSWORD(customerId), {
                newPassword: data.newPassword,
            });

            SuccessAlert(t("update_success"));
            handleFetch();
            reset();
            onClose();
        } catch (error) {
            SuccessAlert("ປ່ຽນລະຫັດຜ່ານລົ້ມເຫຼວ", 1500, "error");
            console.error(error);
        }
    };

    return { register, handleSubmit, submitForm, formState: { errors } };
};