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
        vip_number: z.string(),
        card_type: z.string(),
        goldIssued: z.coerce.date(),
        received: z.string(),
        issued_date: z.coerce.date(),
        expiration_date: z.coerce.date(),
        countCard: z.coerce.number(),

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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const onSubmit = async (data) => {
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
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_CARD, payload);
            handleFetchCard();
            SuccessAlert(t("add_success"));
            onClose();
            // reset
            setValue("carId", "");
            setValue("card_number", "");
            setValue("vip_number", "");
            setValue("card_type", "");
            setValue("goldIssued", "");
            setValue("received", "");
            setValue("issued_date", "");
            setValue("expiration_date", "");
            setValue("countCard", "");
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error("create card failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { register, handleSubmit, control, loading, onSubmit, formState: { errors }, cars, showDropdown, setShowDropdown, search, setSearch, setValue };
};