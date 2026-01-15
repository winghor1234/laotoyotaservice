import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import useToyotaStore from "../../../store/ToyotaStore";

// Zod schema with proper validation
const branchSchema = (t) => z.object({
  branch_name: z
    .string()
    .min(1, { message: t("title_required") })
    .min(2, { message: t("min_length_2") })
    .max(100, { message: t("max_length_100") }),
  location: z
    .string()
    .min(1, { message: t("location_required") })
    .min(5, { message: t("min_length_5") })
    .max(500, { message: t("max_length_500") }),
  phone: z
    .string()
    .min(8, { message: t("phone_min_length_8") })
    .max(15, { message: t("phone_max_length_15") })
    .optional()
});

export const useAddBranchForm = ({ onClose, handleFetchBranch }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("branch");
  const userId = useToyotaStore((state) => state.getUserId());


  const form = useForm({
    resolver: zodResolver(branchSchema(t)),
    defaultValues: {
      userId: "",
      branch_name: "",
      location: "",
      phone: "",
    }
  });

  const { register, handleSubmit,  reset, formState: { errors } } = form;


  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const dataForm = new FormData();
      dataForm.append("userId", userId.trim());
      dataForm.append("branch_name", data.branch_name.trim());
      dataForm.append("location", data.location.trim());
      dataForm.append("phone", data.phone.trim());
      

      const response = await axiosInstance.post(APIPath.CREATE_BRANCH, dataForm);

      if (response.data) {
        await handleFetchBranch();
        SuccessAlert(t("add_success"), 1500, "success");
        reset(); // Reset form using react-hook-form's reset
        onClose();
      }
    } catch (error) {
      console.error("Create Branch failed:", error);
      const errorMessage = error.response?.data?.message || t("add_failed");
      SuccessAlert(errorMessage, 2000, "error");
    } finally {
      setLoading(false);
    }
  };


  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
  };
};