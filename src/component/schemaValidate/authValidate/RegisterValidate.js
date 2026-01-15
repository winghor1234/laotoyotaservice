
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { z } from "zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";


export const registerSchema = (t) => z.object({
  username: z.string().min(2, { message: t("min_length_2") }).max(30),
  phoneNumber: z.string().min(8, { message: t("phone_min_length") }),
  password: z.string().min(6, { message: t("min_length") }).max(20),
  province: z.string().min(2, { message: t("min_length_2") }),
  district: z.string().min(2, { message: t("min_length_2") }),
  village: z.string().min(2, { message: t("min_length_2") }),
});

export const useRegisterForm = () => {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({resolver: zodResolver(registerSchema(t)),});

  const submitForm = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post(APIPath.REGISTER, data)
      SuccessAlert(t("register_success"), 1500, "success");
      navigate("/");
      reset();
    } catch (error) {
      SuccessAlert(t("error"), 1500, "warning");
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { showPassword, setShowPassword, loading, register, handleSubmit, formState: { errors }, submitForm };
};
