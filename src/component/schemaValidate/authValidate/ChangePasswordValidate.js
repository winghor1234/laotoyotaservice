import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const ChangePasswordSchema = (t) =>
    z.object({
        oldPassword: z
            .string()
            .min(6, t("password_min_length")),
        newPassword: z
            .string()
            .min(6, t("password_min_length")),
    });

export const ChangePasswordForm = () => {
    const { t } = useTranslation("auth");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ChangePasswordSchema(t)),
    });

    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.CHANGE_PASSWORD, data);
            SuccessAlert(t("change_password_success"), 1500, "success");
            navigate("/user/dashboard");
        } catch (error) {
            SuccessAlert(t("error"), 1500, "warning");
            console.error("Change password failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };
};
