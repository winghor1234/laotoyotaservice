import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import APIPath from '../../../api/APIPath';
import { SuccessAlert } from '../../../utils/handleAlert/SuccessAlert';
import { useTranslation } from 'react-i18next';



const ProfileUpdateSchema = (t) => z.object({
    username: z.string().min(2, t("min_length_2")),
    email: z.string().email(t("email_invalid")),
    province: z.string().min(2, t("min_length_2")),
    district: z.string().min(2, t("min_length_2")),
    village: z.string().min(2, t("min_length_2")),
    image: z.any().optional(),
    removeImage: z.boolean().optional(),
});


export const ProfileUpdateForm = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(ProfileUpdateSchema(t)) });
    const imageFile = watch("image");

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get(APIPath.GET_PROFILE);
            // console.log(res.data.data);
            setValue("username", res.data.data.username || "");
            setValue("email", res.data.data.email || "");
            setValue("province", res.data.data.province || "");
            setValue("district", res.data.data.district || "");
            setValue("village", res.data.data.village || "");
            setPreview(res.data.data.profile || null);
        } catch (error) {
            console.error("Cannot fetch profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const submitForm = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("province", data.province);
            formData.append("district", data.district);
            formData.append("village", data.village);
            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }
            if (watch("removeImage")) {
                formData.append("removeImage", "true");
            }
            await axiosInstance.put(APIPath.UPDATE_PROFILE, formData);
            SuccessAlert(t("update_success"), 1500, "success");
            navigate("/user/dashboard");
        } catch (error) {
            SuccessAlert(t("error"), 1500, "warning");
            console.error("Update failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, setValue, watch, formState: { errors }, submitForm, loading, imageFile, preview, setPreview };
};
