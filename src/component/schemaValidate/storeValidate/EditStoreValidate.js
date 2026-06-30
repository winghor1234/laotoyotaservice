import { useState, useEffect } from "react";
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
  discount: z.coerce.number().min(0).default(0),
  status: z.boolean().optional(),
});

export const useEditStoreForm = ({ onClose, store_id, handleFetchStore }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      discount: 0,
      status: true,
    }
  });

  useEffect(() => {
    const fetchDataById = async () => {
      if (!store_id) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(APIPath.SELECT_ONE_STORE(store_id));
        const data = res?.data?.data;
        if (data) {
          // parse discount ຈາກ qrCode JSON
          let discount = 0;
          try { discount = JSON.parse(data.qrCode)?.discount ?? 0; } catch (_) {}
          reset({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            discount,
            status: data.status ?? true,
          });
          setExistingImage(data.image || null);
        }
      } catch (error) {
        console.error("Error fetching Store:", error);
        SuccessAlert("ດຶງຂໍ້ມູນຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDataById();
  }, [store_id, reset]);

  const submitForm = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("address", data.address.trim());
      formData.append("phone", data.phone.trim());
      formData.append("discount", data.discount ?? 0);
      formData.append("status", data.status ? "true" : "false");
      if (imageFile) formData.append("image", imageFile);

      const response = await axiosInstance.put(APIPath.UPDATE_STORE(store_id), formData);
      if (response.data) {
        await handleFetchStore();
        SuccessAlert("ແກ້ໄຂຮ້ານຄ້າສຳເລັດ", 1500, "success");
        onClose();
      }
    } catch (error) {
      console.error("Update Store failed:", error);
      SuccessAlert(error.response?.data?.message || "ແກ້ໄຂຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
    } finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, submitForm, errors, loading, imageFile, setImageFile, existingImage, setValue };
};
