import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";

// Zod schema
 const promoSchema = (t) => z.object({
  title: z.string().min(2, { message: t("min_length_2") }),
  detail: z.string().min(5, { message: t("min_length_5") }),
  image: z.any().optional()
});

export const useAddPromotionForm = ({onClose, handleFetchPromotion}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");
  const form = useForm({
    resolver: zodResolver(promoSchema(t))
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const imageFile = watch("image"); // watch image for preview

  const onSubmit = async (data) => {
    setLoading(true);
    const dataForm = new FormData();
    dataForm.append("title", data.title);
    dataForm.append("detail", data.detail);
    if (data.image && data.image[0] instanceof File) {
      dataForm.append("files", data.image[0]);
    }
    console.log(dataForm);

    try {
      await axiosInstance.post(APIPath.CREATE_PROMOTION, dataForm);
      handleFetchPromotion();
      SuccessAlert(t("add_success"));
      onClose();
      // reset fields
      setValue("title", "");
      setValue("detail", "");
      setValue("image", null);
    } catch (error) {
      SuccessAlert(t("add_failed"), 1500, "warning");
      console.error("create promotion failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return {register,handleSubmit,setValue,errors,imageFile,loading,onSubmit};
};
