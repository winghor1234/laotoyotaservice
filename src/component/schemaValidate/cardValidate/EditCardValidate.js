
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ================= SCHEMA =================

export const cardSchema = () =>
    z.object({
        carId: z.string(),
        card_number: z.string(),
        vip_number: z.string(),
        card_type: z.string(),
        goldIssued: z.coerce.date(),
        received: z.string(),
        issued_date: z.coerce.date(),
        expiration_date: z.coerce.date(),
        countCard: z.coerce.number(),
    });

// ================= HOOK =================

export const useEditCardForm = ({ onClose, cardId, handleFetchCard, }) => {
    const { t } = useTranslation("auth");
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm({ resolver: zodResolver(cardSchema()), });
    const currentCarId = watch("carId");

    // ================= FETCH =================
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
                    const matchedCar = allCars.find((car) => car.car_id === cardData.carId);

                    if (matchedCar) {
                        setSelectedCar(matchedCar);
                        setSearch(`${matchedCar.engineNumber} ${matchedCar.frameNumber}`);
                    }
                    reset({
                        carId: String(cardData?.carId || ""),
                        card_number: cardData?.card_number || "",
                        vip_number: cardData?.vip_number || "",
                        card_type: cardData?.card_type || "",
                        goldIssued: cardData?.goldIssued ? new Date(cardData.goldIssued) : null,
                        received: cardData?.received || "",
                        issued_date: cardData?.issued_date ? new Date(cardData.issued_date) : null,
                        expiration_date: cardData?.expiration_date ? new Date(cardData.expiration_date) : null,
                        countCard: cardData?.countCard || 0,
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching card:", error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [cardId, setValue]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // select car
    const handleSelectCar = (car) => {
        setSelectedCar(car);
        setSearch(`${car.engineNumber} ${car.frameNumber}`);
        setValue("carId", String(car.car_id));
        setShowDropdown(false);
    };
    // ================= SUBMIT =================

    const submitForm = async (data) => {
        setLoading(true);
        const payload = {
            carId: data.carId,
            card_number: data.card_number,
            vip_number: data.vip_number,
            card_type: data.card_type,
            received: data.received,
            goldIssued: data.goldIssued.toISOString(),
            issued_date: data.issued_date.toISOString(),
            expiration_date: data.expiration_date.toISOString(),
            countCard: data.countCard,
        }
        try {
            await axiosInstance.put(APIPath.UPDATE_CARD(cardId), payload);
            handleFetchCard();
            SuccessAlert(t("update_success"));
            onClose();
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "warning");
            console.error("Update card failed:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    return {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        loading,
        submitForm,
        control,
        cars,
        currentCarId,
        showDropdown,
        setShowDropdown,
        search,
        setSearch,
        dropdownRef,
        handleSelectCar,
        reset,
        selectedCar,
        setSelectedCar,
    };
};