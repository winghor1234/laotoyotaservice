import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Enhanced Zod schema with better validation
export const EmployeeSchema = (t) => z.object({
    userId: z
        .string()
        .min(2, { message: t("min_length_2") })
        .max(500, { message: t("max_length_500") }),
    branchId: z
        .string()
        .min(5, { message: t("min_length_5") })
        .max(500, { message: t("max_length_500") }),
    employee_name: z
        .string()
        .min(5, { message: t("min_length_5") })
        .max(500, { message: t("max_length_500") }),
    position: z
        .string()
        .min(5, { message: t("min_length_5") })
        .optional()
});

export const useEditEmployeeForm = ({ onClose, employee_id, handleFetchEmployee }) => {
    const { t } = useTranslation("employee");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(EmployeeSchema(t)),
        defaultValues: {
            userId: "",
            branchId: "",
            employee_name: "",
            position: "",
        }
    });


    useEffect(() => {
        const fetchDataById = async () => {
            if (!employee_id) return;

            setLoading(true);
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_EMPLOYEE(employee_id));
                const data = res?.data?.data;

                if (data) {
                    reset({
                        userId: data.userId || "",
                        branchId: data.branchId || "",
                        employee_name: data.employee_name || "",
                        position: data.position || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching Branch:", error);
                SuccessAlert(t("fetch_error"), 2000, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDataById();
    }, [employee_id, reset, t]);

    const submitForm = async (data) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("userId", data.userId.trim());
            formData.append("branchId", data.branchId.trim());
            formData.append("employee_name", data.employee_name.trim());
            formData.append("position", data.position.trim());

            const response = await axiosInstance.put(
                APIPath.UPDATE_EMPLOYEE(employee_id), formData);

            if (response.data) {
                await handleFetchEmployee();
                SuccessAlert(t("update_success"), 1500, "success");
                onClose();
            }
        } catch (error) {
            console.error("Update Employee failed:", error);
            const errorMessage = error.response?.data?.message || t("update_failed");
            SuccessAlert(errorMessage, 2000, "error");
        } finally {
            setLoading(false);
        }
    };


    // Helper function to check if form has changes
    const hasChanges = () => {
        return isDirty;
    };

    return {
        register,
        handleSubmit,
        errors,
        loading,
        submitForm,
        formState: { isDirty, errors },
        hasChanges,
        reset
    };
};