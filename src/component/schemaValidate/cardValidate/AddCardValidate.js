import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import { useEffect } from "react";

// Schema
const cardSchema = () =>
    z.object({
        carId: z.string(),
        card_number: z.string(),
        card_type: z.string(),
        received: z.string(),
        expiration_date: z.coerce.date(),
    });

export const useAddCardForm = ({ onClose, handleFetchCard, }) => {
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const { t } = useTranslation("auth");
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const form = useForm({ resolver: zodResolver(cardSchema()), });
    const { register, handleSubmit, setValue, control, formState: { errors }, } = form;


    useEffect(() => {
        Promise.all([
            axiosInstance.get(APIPath.SELECT_ALL_CAR),
        ])
            .then(([carRes]) => {
                const carData = carRes?.data?.data || [];
                setCars(carData);
            })
            .catch((error) => {
                console.error("Error fetching car:", error);
            })

    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // ตรวจสอบว่าจุดที่คลิก อยู่นอกพื้นที่ของขอบเขตที่เรากำหนดไว้ใน ref หรือไม่
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // ลงทะเบียน Event
        document.addEventListener("mousedown", handleClickOutside);

        // คืนทรัพยากร (Cleanup)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // [] หมายความว่าให้ทำงานเฉพาะตอน Component mount ครั้งแรกเท่านั้น


    const onSubmit = async (data) => {
        const payload = {
            carId: data.carId,
            card_number: data.card_number,
            card_type: data.card_type,
            received: data.received,
            expiration_date: data.expiration_date.toISOString(),
        }
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_CARD, payload);
            handleFetchCard();
            SuccessAlert(t("add_success"));
            onClose();
            // reset
            setValue("carId", "");
            setValue("card_number", "");
            setValue("card_type", "");
            setValue("received", "");
            setValue("expiration_date", "");
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("create card failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, control, loading, onSubmit, formState: { errors }, cars, showDropdown, setShowDropdown, search, setSearch, setValue, dropdownRef };
};