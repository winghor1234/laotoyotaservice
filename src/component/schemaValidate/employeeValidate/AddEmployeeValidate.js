import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";

// Zod schema with proper validation
const employeeSchema = (t) => z.object({
    userId: z
        .string()
        .min(1, { message: t("title_required") })
        .max(100, { message: t("max_length_100") }),
    branchId: z
        .string()
        .min(1, { message: t("title_required") })
        .max(100, { message: t("max_length_100") }),
    employee_name: z
        .string()
        .min(1, { message: t("employee_name_required") })
        .min(2, { message: t("min_length_2") })
        .max(500, { message: t("max_length_500") }),
    position: z
        .string()
        .min(1, { message: t("position_required") })
        .min(5, { message: t("min_length_5") })
        .max(500, { message: t("max_length_500") }),
});
    

export const useAddEmployeeForm = ({ onClose, handleFetchEmployee }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation("employee");
    // const userId = useToyotaStore((state) => state.getUserId());


    const form = useForm({
        resolver: zodResolver(employeeSchema(t)),
        defaultValues: {
            userId: "",
            branchId: "",
            employee_name: "",
            position: "",
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = form;



    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const dataForm = new FormData();
            dataForm.append("userId", data.userId.trim());
            dataForm.append("branchId", data.branchId.trim());
            dataForm.append("employee_name", data.employee_name.trim());
            dataForm.append("position", data.position.trim());
            console.log(`dataForm: `, dataForm);
            const response = await axiosInstance.post(APIPath.CREATE_EMPLOYEE, dataForm);
            if (response.data) {
                await handleFetchEmployee();
                SuccessAlert(t("add_success"), 1500, "success");
                reset(); // Reset form using react-hook-form's reset
                onClose();
            }
        } catch (error) {
            console.error("Create Employee failed:", error);
            const errorMessage = error.response?.data?.message || t("add_failed");
            SuccessAlert(errorMessage, 2000, "error");
        } finally {
            setLoading(false);
        }
    };


    return {
        register,
        handleSubmit,
        formState: { errors },
        loading,
        onSubmit,
        reset,
    };
};