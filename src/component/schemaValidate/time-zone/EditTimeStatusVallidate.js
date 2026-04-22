import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { formatDate } from "../../../utils/FormatDate";
import { useTranslation } from "react-i18next";




const EditTimeStatusSchema = (t) => z.object({
    qty: z.string().min(1, t("min_length_1")),
});

export const useEditTimeStatusForm = ({ timeId, fetchTime, onClose }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(EditTimeStatusSchema(t)), });
    const [loading, setLoading] = useState(false);
    const [currentTime, setcurrentTime] = useState(null);
    // Fetch time data
    useEffect(() => {
        if (!timeId) return;
        const fetchTime = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_TIME(timeId));
                const data = res?.data?.data;
                setcurrentTime(data?.time);
                // console.log("qty ",data?.qty);
                if (data) {
                    reset({
                        time: data.time,
                        qty: "",
                        // date: formatDate(data.date),
                    });
                }
            } catch (error) {
                console.error("Error fetching time:", error);
            }
        };
        fetchTime();
    }, [timeId, reset]);

    const submitForm = async (data) => {
        const payload = {
            time: currentTime,
            qty: data.qty,
        };
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.UPDATE_TIME(timeId), payload);
            await axiosInstance.put(APIPath.UPDATE_TIME_STATUS(timeId), { timeStatus: true });
            SuccessAlert(t("update_success"));
            fetchTime();
            onClose();
            reset();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update time failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };

}