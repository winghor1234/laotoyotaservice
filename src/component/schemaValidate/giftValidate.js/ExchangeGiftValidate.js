import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

const exchangeGiftSchema = (t) => z.object({
    // userId: z.string().min(1, t("min_length_1")),
    giftcardId: z.string().min(1, t("min_length_1")),
    cardId: z.string().min(1, t("min_length_1")),
    amount: z.string().min(1, t("min_length_1")),
});

export const useExchangeGiftForm = ({ onClose, handleFetch, }) => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, formState: { errors },setValue } = useForm({ resolver: zodResolver(exchangeGiftSchema(t)), });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [giftCardSearch, setGiftCardSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showGiftDropdown, setShowGiftDropdown] = useState(false);
    const cardDropdownRef = useRef(null);
    const giftCardDropdownRef = useRef(null);
    const [giftCards, setGiftCards] = useState([]);
    const [cards, setCards] = useState([]);



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

    useEffect(() => {
        const handleClickOutside = (event) => {
            // เช็คตัวที่ 1: คลิกนอก Card Dropdown หรือไม่?
            if (cardDropdownRef.current && !cardDropdownRef.current.contains(event.target)) {
                setShowDropdown(false); // หรือ State ของ Card เช่น setShowCardDropdown(false)
            }

            // เช็คตัวที่ 2: คลิกนอก Gift Card Dropdown หรือไม่?
            if (giftCardDropdownRef.current && !giftCardDropdownRef.current.contains(event.target)) {
                setShowGiftDropdown(false); // State ของ Gift Card
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_GIFT_HISTORY, data);
            SuccessAlert(t("exchange_success"))
            handleFetch();
            onClose();
        } catch (error) {
            const message = error.response?.data?.message == "Point Not Enough" ? t("point_not_enough") : error.response?.data?.message;
            SuccessAlert(t(message), 1500, "warning");
        } finally {
            setLoading(false);
        }
    };
    return { register, handleSubmit, loading, formState: { errors }, submitForm, users, giftCards, cards, search, setSearch, giftCardSearch, setGiftCardSearch, showDropdown, setShowDropdown, showGiftDropdown, setShowGiftDropdown,cardDropdownRef, giftCardDropdownRef, setValue };
};

