import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SuccessAlert } from '../../../utils/handleAlert/SuccessAlert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import APIPath from '../../../api/APIPath';
import useToyotaStore from '../../../store/ToyotaStore';
import axiosInstance from '../../../utils/AxiosInstance';
import { useTranslation } from 'react-i18next';



const LoginSchema = (t) => z.object({
    phoneNumber: z.string().min(8, t("phone_min_length")),
    password: z.string().min(6, t("password_min_length")),
});

export const useLoginForm = () => {
    const { t } = useTranslation("auth");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(LoginSchema(t)),
    });
    const setToken = useToyotaStore((state) => state.setToken);
    const setUserId = useToyotaStore((state) => state.setUserId);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(APIPath.LOGIN_ADMIN, data)
            const token = res?.data?.data?.token;
            const refreshToken = res?.data?.data?.refreshToken;
            const userId = res?.data?.data?.user_id;
            const tokenExpire = Date.now() + 60 * 60 * 1000; // 1 ชั่วโมง = 3600000 ms
            setToken(token, refreshToken, tokenExpire);
            setUserId(userId);
            SuccessAlert(t("login_success"), 1500, "success");
            navigate("/user/dashboard");
            reset();
            console.log("Login successful:", res.data);
        } catch (error) {
            SuccessAlert(t("error"), 1500, "warning");
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { showPassword, setShowPassword, loading, register, handleSubmit, formState: { errors }, submitForm };
}
