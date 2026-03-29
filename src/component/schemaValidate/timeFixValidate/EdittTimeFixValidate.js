import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";




const EditTimeFixSchema = (t) => z.object({
    timeId: z.string().min(1, t("min_length_1")),
    zoneId: z.string().min(1, t("min_length_1")),
});

export const useEditTimeFixForm = ({ timefix_id , fetchTimeFix, onClose }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(EditTimeFixSchema(t)), });
    const [loading, setLoading] = useState(false);
    const [zone, setZone] = useState([]);
    const [time, setTime] = useState([]);
    const [branch, setBranch] = useState([]);

    // Fetch zones
    useEffect(() => {
        const fetch = async () => {
            try {
                const [zoneRes, timeRes, branchRes] = await Promise.all([
                    axiosInstance.get(APIPath.SELECT_ALL_ZONE),
                    axiosInstance.get(APIPath.SELECT_ALL_TIME),
                    axiosInstance.get(APIPath.SELECT_ALL_BRANCH),

                ]);

                if (zoneRes?.data?.data) {
                    setZone(zoneRes.data.data);
                }

                if (timeRes?.data?.data) {
                    setTime(timeRes.data.data);
                }
                if (branchRes?.data?.data) {
                    setBranch(branchRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching :", error);
            }
        };
        fetch();
    }, []);

    const submitForm = async (data) => {
        // console.log("time fix date ; ",data);
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.UPDATE_TIME_FIX(timefix_id), data);
            SuccessAlert(t("update_success"));
            fetchTimeFix();
            onClose();
            reset();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update time failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading, zone, time, branch };

}