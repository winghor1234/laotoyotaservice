import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const AddTimeFixSchema = (t) => z.object({
    timeId: z.string().min(1, t("min_length_1")),
    zoneId: z.string().min(1, t("min_length_1")),
    branchId: z.string().min(1, t("min_length_1")),
});

export const useAddTimeFixForm = ({ onClose, fetchTimeFix }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(AddTimeFixSchema(t)), });
    const [loading, setLoading] = useState(false);
    const [zone, setZone] = useState([]);
    const [time, setTime] = useState([]);
    const [branch, setBranch] = useState([]);


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
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_TIME_FIX, data);
            SuccessAlert(t("add_success"));
            fetchTimeFix();
            // if (addToExport) {
            //     addToExport({ ...data, status: "ຫວ່າງ" });
            // }
            reset();
            onClose();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("Error adding time:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading, zone, time , branch};

}