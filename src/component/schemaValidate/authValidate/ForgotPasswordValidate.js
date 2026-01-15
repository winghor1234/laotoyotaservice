import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

// ✅ Schema ใช้ function เพื่อให้ dynamic ตามภาษา
const ForgotPasswordSchema = (t) =>
  z.object({
    phoneNumber: z
      .string()
      .min(8, t("phone_min_length")),
    newPassword: z
      .string()
      .min(6, t("password_min_length")),
  });

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema(t)),
  });

  const submitForm = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(APIPath.FORGOT, data);
      SuccessAlert(t("change_password_success"), 1500, "success");
      navigate("/");
    } catch (error) {
      SuccessAlert(t("error"), 1500, "warning");
      console.error("Password reset failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    loading,
    register,
    handleSubmit,
    formState: { errors },
    submitForm,
  };
};
