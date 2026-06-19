

import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const cardSchema = () => z.object({
    carId: z.string().min(1, "Required"),
    card_number: z.string().min(1, "Required"),
    card_type: z.string().min(1, "Required"),
    received: z.string(),
    expiration_date: z.coerce.date(),
});

export const useEditCardForm = ({ onClose, cardId, handleFetchCard }) => {
    const { t } = useTranslation("auth");
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const dropdownRef = useRef(null);

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(cardSchema()),
    });

    const currentCarId = watch("carId");

    // Fetch Initial Data
    useEffect(() => {
        if (!cardId) return;
        setLoading(true);
        Promise.all([
            axiosInstance.get(APIPath.SELECT_ONE_CARD(cardId)),
            axiosInstance.get(APIPath.SELECT_ALL_CAR),
        ])
            .then(([cardRes, carRes]) => {
                const cardData = cardRes?.data?.data;
                const allCars = carRes?.data?.data || [];
                setCars(allCars);

                if (cardData) {
                    const matchedCar = allCars.find(c => c.car_id === cardData.carId);
                    if (matchedCar) {
                        setSearch(`${matchedCar.engineNumber} ${matchedCar.frameNumber}`);
                    }

                    reset({
                        carId: String(cardData.carId),
                        card_number: cardData.card_number,
                        card_type: cardData.card_type,
                        received: cardData.received,
                        expiration_date: cardData.expiration_date ? cardData.expiration_date.split('T')[0] : "",
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [cardId, reset]);

    // Click Outside
    useEffect(() => {
        const handleOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const handleSelectCar = (car) => {
        setSearch(`${car.engineNumber} ${car.frameNumber}`);
        setValue("carId", String(car.car_id));
        setShowDropdown(false);
    };

    const submitForm = async (data) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                expiration_date: new Date(data.expiration_date).toISOString(),
            };
            const res = await axiosInstance.put(APIPath.UPDATE_CARD(cardId), payload);
            const message = res.data.message == "Card already exists" ? t("card_exist") : t("add_success");
            if (message == t("card_exist")) { SuccessAlert(message, 1500, "warning") }
            else {
                SuccessAlert(t("update_success"));
                handleFetchCard();
                onClose();
            }
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update card failed:", error);

        } finally {
            setLoading(false);
        }
    };

    return {
        register, handleSubmit, submitForm, loading, formState: { errors },
        cars, search, setSearch, showDropdown, setShowDropdown,
        dropdownRef, handleSelectCar, currentCarId, setValue
    };
};