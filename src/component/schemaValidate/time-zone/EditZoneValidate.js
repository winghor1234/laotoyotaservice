import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const EditZoneSchema = (t) => z.object({
    zoneName: z.string().min(1, t("min_length_1")),
    timeFix: z.string().min(1, t("min_length_1")),
});


export const useEditZoneForm = ({ zoneId, fetchZone, onClose }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(EditZoneSchema(t)), });
    const [loading, setLoading] = useState(false);
    const handleFetchZone = async () => {
        if (!zoneId) return;
        const res = await axiosInstance.get(APIPath.SELECT_ONE_ZONE(zoneId));
        const resData = res?.data?.data;
        if (resData) {
            reset({
                zoneName: resData.zoneName,
                timeFix: resData.timeFix,
            });
        }
    };

    useEffect(() => {
        handleFetchZone();
    }, [zoneId]);
    // console.log(zoneId)


    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.UPDATE_ZONE(zoneId), data);
            // console.log("Update gift successful:", res.data);
            SuccessAlert(t("update_success"));
            fetchZone();
            onClose();
            reset();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update zone failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };



}