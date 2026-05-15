import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

const exchangeGiftSchema = (t) => z.object({
    userId: z.string().min(1, t("min_length_1")),
    giftcardId: z.string().min(1, t("min_length_1")),
    cardId: z.string().min(1, t("min_length_1")),
    // card_number: z.string().min(1, t("min_length_1")),
    // gift_Code: z.string().min(1, t("min_length_1")),
    amount: z.string().min(1, t("min_length_1")),
});

export const useExchangeGiftForm = ({ onClose, handleFetch, }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(exchangeGiftSchema(t)), });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [giftCards, setGiftCards] = useState([]);
    const [cards, setCards]= useState([]);



    const handleFetchAll = async () => {
        try {
            const [userRes, giftCardRes, cardRes] = await Promise.all([
                axiosInstance.get(APIPath.SELECT_ALL_USER),
                axiosInstance.get(APIPath.SELECT_ALL_GIFT),
                axiosInstance.get(APIPath.SELECT_ALL_CARD),
            ]);
            const usersData = userRes?.data?.data;
            const giftCardsData = giftCardRes?.data?.data;
            const cardData = cardRes?.data?.data;
            setUsers(usersData);
            setGiftCards(giftCardsData);
            setCards(cardData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        handleFetchAll();
    }, []);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_GIFT_HISTORY, data);
            handleFetch();
            onClose();
            SuccessAlert(t("add_success"))
        } catch (error) {
            const message = error.response?.data?.message;
            SuccessAlert(t(message), 1500, "warning");
        } finally {
            setLoading(false);
        }
    };
    return { register, handleSubmit, loading, formState: { errors }, submitForm, users, giftCards, cards };
};

