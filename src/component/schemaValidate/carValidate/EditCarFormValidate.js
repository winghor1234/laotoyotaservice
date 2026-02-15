import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";



const editCarSchema = (t) =>z.object({
    // userId: z.string().min(2, t("min_length_2")),
    model: z.string().min(2, t("min_length_2")),
    engineNumber: z.string().min(2, t("min_length_2")),
    frameNumber: z.string().min(2, t("min_length_2")),
    plateNumber: z.string().min(2, t("min_length_2")),
    province: z.string().min(2, t("min_length_2")),
    color: z.string().min(2, t("min_length_2")),
});

export const useEditCarForm = ({ carId, handleFetchCar, onClose }) => {
    const { t } = useTranslation("auth");
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
         
        resolver: zodResolver(editCarSchema(t))
    });


    useEffect(() => {
        if (!carId) return;
        Promise.all([
            axiosInstance.get(APIPath.SELECT_ONE_CAR(carId)),
            axiosInstance.get(APIPath.SELECT_ALL_USER),
        ])
            .then(([carResponse, usersResponse]) => {
                // ตั้งค่า users state สำหรับ select dropdown
                setUsers(usersResponse?.data?.data || []);

                // ตั้งค่า default values ของ form ให้ตรงกับข้อมูลรถ
                const carData = carResponse?.data?.data;
                if (carData) {
                    reset({
                        userId: String(carData.userId) || "",
                        model: carData.model || "",
                        engineNumber: carData.engineNumber || "",
                        frameNumber: carData.frameNumber || "",
                        plateNumber: carData.plateNumber || "",
                        province: carData.province || "",
                        color: carData.color || "",
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching car details:", error);
            });
    }, [carId, reset]);

    // submit form
    const submitForm = async (data) => {
        try {
            await axiosInstance.put(APIPath.UPDATE_CAR(carId), data);
            handleFetchCar();
            SuccessAlert(t("update_success"));
            onClose();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Error updating car:", error);
        }
    };


    return { register,handleSubmit,submitForm,formState: { errors },users,reset, };
}