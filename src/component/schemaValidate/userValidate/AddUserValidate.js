import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";


const UserSchema = (t) => z.object({
  username: z.string().min(1, { message: t("min_length_1") }).max(30),
  phoneNumber: z.string().min(8, { message: t("phone_min_length") }),
  password: z.string().min(6, { message: t("min_length") }).max(20),
  province: z.string().min(1, { message: t("min_length_1") }),
  district: z.string().min(1, { message: t("min_length_1") }),
  village: z.string().min(1, { message: t("min_length_1") }),
});

export const useAddUserForm = ({ handleFetch, onClose }) => {
    const { t } = useTranslation('auth');
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(UserSchema(t)) });
    const [loading, setLoading] = useState(false);
    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.REGISTER, data)
            SuccessAlert(t("add_success"));
            handleFetch();
            onClose();
            reset();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "error");
            console.error("Add User failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };
}