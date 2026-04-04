import {  useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const AddTimeSchema = (t) => z.object({
    time: z.string().min(1, t("min_length_1")),
    qty: z.number().min(1, t("min_length_1")),
});

export const useAddTimeForm = ({ onClose, fetchTime, addToExport }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(AddTimeSchema(t)), });
    const [loading, setLoading] = useState(false);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            // console.log("Time data : ", typeof(data.time), typeof(data.qty));
            await axiosInstance.post(APIPath.CREATE_TIME, data);
            SuccessAlert(t("add_success"));
            fetchTime();
            if (addToExport) {
                addToExport({ ...data, status: "ຫວ່າງ" });
            }
            reset();
            onClose();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("Error adding time:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, formState: { errors }, submitForm, loading };

}