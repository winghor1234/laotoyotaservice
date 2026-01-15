import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";



const schema = (t) => z.object({
    username: z.string().min(1, t("min_length_1")),
    phoneNumber: z.string().min(8, t("phone_min_length")).regex(/^\d+$/, "ເບີໂທຕ້ອງເປັນຕົວເລກ"),
    village: z.string().min(2, t("min_length_1")),
    district: z.string().min(2, t("min_length_1")),
    province: z.string().min(2, t("min_length_1")),
    email: z.string().email(t("email_invalid")).optional().or(z.literal("")),
});

export const useEditUserForm = ({ customerId, handleFetch, onClose }) => {
    const { t } = useTranslation('auth');
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema(t)), });
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_USER(customerId));
                reset({
                    username: res?.data?.data?.username || "",
                    phoneNumber: res?.data?.data?.phoneNumber?.toString() || "",
                    province: res?.data?.data?.province || "",
                    district: res?.data?.data?.district || "",
                    village: res?.data?.data?.village || "",
                    email: res?.data?.data?.email || "",
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (customerId) fetchUser();
    }, [customerId, reset]);

    const submitForm = async (formData) => {
        try {
            const payload = {
                ...formData,
                phoneNumber: parseInt(formData.phoneNumber, 10),
                email: formData.email === "" ? null : formData.email,
            };

            await axiosInstance.put(APIPath.UPDATE_CUSTOMER(customerId), payload);
            SuccessAlert(t("update_success"));
            handleFetch();
            onClose();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "error");
            console.error("Error updating user:", error);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm };

}