import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";

const productSchema = z.object({
    name: z.string().min(1, "ກະລຸນາໃສ່ຊື່ສິນຄ້າ").max(200),
    price: z.coerce.number().min(0, "ລາຄາຕ້ອງ >= 0"),
    amount: z.coerce.number().min(0, "ຈຳນວນຕ້ອງ >= 0").default(0),
    discount: z.coerce.number().min(0, "ສ່ວນຫຼຸດຕ້ອງ >= 0").default(0),
    status: z.boolean().optional(),
});

export const useAddProductForm = ({ onClose, store_id, handleFetchProduct }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const { register, handleSubmit, reset,watch,setValue, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: "",
            amount: "",
            discount: "",
            status: true,
        }
    });

    const onSubmit = async (data) => {
        console.log("Submitting product data:", data);
        console.log("store_id:", store_id);
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("price", data.price ?? 0);
            formData.append("amount", data.amount ?? 0);
            formData.append("discount", data.discount ?? 0);
            formData.append("status", data.status ? "true" : "false");
            formData.append("storeId", store_id);
            if (imageFile) formData.append("files", imageFile);
            console.log("formData : ",formData);

            const response = await axiosInstance.post(APIPath.CREATE_PRODUCT, formData);
            if (response.data) {
                await handleFetchProduct();
                SuccessAlert("ເພີ່ມສິນຄ້າສຳເລັດ", 1500, "success");
                reset();
                setImageFile(null);
                onClose();
            }
        } catch (error) {
            console.error("Create Product failed:", error);
            SuccessAlert(error.response?.data?.message || "ເພີ່ມສິນຄ້າລົ້ມເຫລວ", 2000, "error");
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, errors, loading, onSubmit, imageFile, setImageFile, reset,setValue,watch };
};