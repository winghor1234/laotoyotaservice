import { useState, useEffect } from "react";
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

export const useEditProductForm = ({ onClose, product_id, handleFetchProduct }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            amount: 0,
            discount: 0,
            status: true,
        }
    });

    useEffect(() => {
        const fetchDataById = async () => {
            if (!product_id) return;
            setLoading(true);
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_PRODUCT(product_id));
                const data = res?.data?.data;
                if (data) {
                    reset({
                        name: data.name || "",
                        price: data.price ?? 0,
                        amount: data.amount ?? 0,
                        discount: data.discount ?? 0,
                        status: data.status ?? true,
                    });
                    setExistingImage(data.image || null);
                }
            } catch (error) {
                console.error("Error fetching Product:", error);
                SuccessAlert("ດຶງຂໍ້ມູນສິນຄ້າລົ້ມເຫລວ", 2000, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchDataById();
    }, [product_id, reset]);

    const submitForm = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("price", data.price ?? 0);
            formData.append("amount", data.amount ?? 0);
            formData.append("discount", data.discount ?? 0);
            formData.append("status", data.status ? "true" : "false");
            if (imageFile) formData.append("image", imageFile);

            const response = await axiosInstance.put(APIPath.UPDATE_PRODUCT(product_id), formData);
            if (response.data) {
                await handleFetchProduct();
                SuccessAlert("ແກ້ໄຂສິນຄ້າສຳເລັດ", 1500, "success");
                onClose();
            }
        } catch (error) {
            console.error("Update Product failed:", error);
            SuccessAlert(error.response?.data?.message || "ແກ້ໄຂສິນຄ້າລົ້ມເຫລວ", 2000, "error");
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, submitForm, errors, loading, imageFile, setImageFile, existingImage, setValue, watch };
};