import { useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";




// Schema Validation
const serviceSchema = (t) => z.object({
  nameService: z.string().min(1, t("min_length_1")),
  description: z.string().min(1, t("min_length_1")),
  image: z.any().optional(),
});


export const useAddServiceForm = ({ onClose, handleFetch }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm({ resolver: zodResolver(serviceSchema(t)), });
    const [loading, setLoading] = useState(false);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            const dataForm = new FormData();
            dataForm.append("serviceName", data.nameService);
            dataForm.append("description", data.description);
            // if (data.image instanceof File) dataForm.append("files", data.image);
             if (data.image && data.image[0] instanceof File) {
                dataForm.append("files", data.image[0]);
            }
            await axiosInstance.post(APIPath.CREATE_SERVICE, dataForm);
            SuccessAlert(t("add_success"));
            handleFetch();
            onClose();
            // Reset form
            setValue("nameService", "");
            setValue("description", "");
            setValue("image", null);
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("create service failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return { register, handleSubmit, submitForm,  formState: { errors }, loading, control  };
}