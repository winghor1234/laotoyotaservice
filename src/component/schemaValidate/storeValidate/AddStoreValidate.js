import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";

const storeSchema = z.object({
  name: z.string().min(1, "ກະລຸນາໃສ່ຊື່ຮ້ານ").max(200),
  address: z.string().min(1, "ກະລຸນາໃສ່ທີ່ຢູ່").max(500),
  phone: z.string().min(8, "ເບີໂທຕ້ອງຢ່າງໜ້ອຍ 8 ຕົວເລກ").max(15),
  discount: z.coerce.number().min(0, "ສ່ວນຫຼຸດຕ້ອງ >= 0").default(0),
  status: z.boolean().optional(),
});

export const useAddStoreForm = ({ onClose, handleFetchStore }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      discount: 0,
      status: true,
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("address", data.address.trim());
      formData.append("phone", data.phone.trim());
      formData.append("discount", data.discount ?? 0);
      formData.append("status", data.status ? "true" : "false");
      if (imageFile) formData.append("image", imageFile);

      const response = await axiosInstance.post(APIPath.CREATE_STORE, formData);
      if (response.data) {
        await handleFetchStore();
        SuccessAlert("ເພີ່ມຮ້ານຄ້າສຳເລັດ", 1500, "success");
        reset();
        setImageFile(null);
        onClose();
      }
    } catch (error) {
      console.error("Create Store failed:", error);
      SuccessAlert(error.response?.data?.message || "ເພີ່ມຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
    } finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, loading, onSubmit, imageFile, setImageFile, reset };
};
