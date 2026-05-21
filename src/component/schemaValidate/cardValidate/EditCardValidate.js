// import { z } from "zod";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axiosInstance from "../../../utils/AxiosInstance";
// import APIPath from "../../../api/APIPath";
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// // Schema
// export const cardSchema = (t) =>
//     z.object({
//         userId: z.string().min(1, {
//             message: t("required"),
//         }),

//         // customer_number: z
//         //     .string()
//         //     .min(2, { message: t("min_length_2") }),

//         card_number: z
//             .string()
//             .min(2, { message: t("min_length_2") }),

//         vip_number: z
//             .string()
//             .min(1, { message: t("required") }),

//         discount: z.coerce.number().min(0, {
//             message: t("required"),
//         }),
//     });

// export const useEditCardForm = ({ onClose, cardId, handleFetchCard, }) => {
//     const { t } = useTranslation("auth");
//     const [loading, setLoading] = useState(false);
//     const [users, setUsers] = useState([]);
//     const { register, handleSubmit, setValue, reset, control, formState: { errors }, } = useForm({ resolver: zodResolver(cardSchema(t)), });

//     useEffect(() => {
//         if (!cardId) return;
//         setLoading(true);
//         Promise.all([
//             axiosInstance.get(APIPath.SELECT_ONE_CARD(cardId)),
//             axiosInstance.get(APIPath.SELECT_ALL_USER),])
//             .then(([cardRes, userRes]) => {
//                 const cardData = cardRes?.data?.data;
//                 const userData = userRes?.data?.data || [];
//                 setUsers(userData);
//                 reset({
//                     userId: cardData?.userId || "",
//                     // customer_number: cardData?.customer_number || "",
//                     card_number: cardData?.card_number || "",
//                     vip_number: cardData?.vip_number || "",
//                     discount: cardData?.discount || 0,
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error fetching card:", error);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     }, [cardId]);

//     // submit
//     const submitForm = async (data) => {
//         setLoading(true);

//         try {
//             await axiosInstance.put(
//                 APIPath.UPDATE_CARD(cardId),
//                 {
//                     userId: data.userId,
//                     customer_number: data.customer_number,
//                     card_number: data.card_number,
//                     vip_number: data.vip_number,
//                     discount: data.discount,
//                 }
//             );

//             handleFetchCard();

//             SuccessAlert(
//                 t("update_success")
//             );

//             onClose();
//         } catch (error) {
//             SuccessAlert(
//                 t("update_failed"),
//                 1500,
//                 "warning"
//             );

//             console.error(
//                 "Update card failed:",
//                 error.response?.data ||
//                 error.message
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//         loading,
//         submitForm,
//         control,
//         users
//     };
// };



import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ================= SCHEMA =================

export const cardSchema = (t) =>
    z.object({

        userId: z.string().min(1, {
            message: t("required"),
        }),

        card_number: z
            .string()
            .min(2, {
                message: t("min_length_2")
            }),

        vip_number: z
            .string()
            .min(1, {
                message: t("required")
            }),

        discount: z.coerce.number().min(0, {
            message: t("required"),
        }),

        // ================= NEW =================

        card_type: z.string().max(1).optional(),

        goldIssued: z.coerce.date().optional(),

        received: z.string().max(1).optional(),

        issued_date: z.coerce.date().optional(),

        expiration_date: z.coerce.date().optional(),

        plate_number: z.string().max(10).optional(),

        vehicle_model: z.string().max(30).optional(),

        color: z.string().max(20).optional(),

        frame_number: z.string().max(30).optional(),

        engine_number: z.string().max(30).optional(),

        active_point: z.coerce.number().optional(),

        total_point: z.coerce.number().optional(),

        running_part: z.coerce.number().optional(),

        running_labour: z.coerce.number().optional(),

        countCard: z.coerce.number().optional(),
    });

// ================= HOOK =================

export const useEditCardForm = ({
    onClose,
    cardId,
    handleFetchCard,
}) => {

    const { t } = useTranslation("auth");

    const [loading, setLoading] =
        useState(false);

    const [users, setUsers] =
        useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver:
            zodResolver(cardSchema(t)),
    });

    // ================= FETCH =================

    useEffect(() => {

        if (!cardId) return;

        setLoading(true);

        Promise.all([
            axiosInstance.get(
                APIPath.SELECT_ONE_CARD(cardId)
            ),

            axiosInstance.get(
                APIPath.SELECT_ALL_USER
            ),
        ])

            .then(([cardRes, userRes]) => {

                const cardData =
                    cardRes?.data?.data;

                const userData =
                    userRes?.data?.data || [];

                setUsers(userData);

                reset({

                    userId:
                        cardData?.userId || "",

                    card_number:
                        cardData?.card_number || "",

                    vip_number:
                        cardData?.vip_number || "",

                    discount:
                        cardData?.discount || 0,

                    // ================= NEW =================

                    card_type:
                        cardData?.card_type || "",

                    goldIssued:
                        cardData?.goldIssued
                            ?.split("T")[0] || "",

                    received:
                        cardData?.received || "",

                    issued_date:
                        cardData?.issued_date
                            ?.split("T")[0] || "",

                    expiration_date:
                        cardData?.expiration_date
                            ?.split("T")[0] || "",

                    plate_number:
                        cardData?.plate_number || "",

                    vehicle_model:
                        cardData?.vehicle_model || "",

                    color:
                        cardData?.color || "",

                    frame_number:
                        cardData?.frame_number || "",

                    engine_number:
                        cardData?.engine_number || "",

                    active_point:
                        cardData?.active_point || 0,

                    total_point:
                        cardData?.total_point || 0,

                    running_part:
                        cardData?.running_part || 0,

                    running_labour:
                        cardData?.running_labour || 0,

                    countCard:
                        cardData?.countCard || 0,
                });

            })

            .catch((error) => {

                console.error(
                    "Error fetching card:",
                    error
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, [cardId]);

    // ================= SUBMIT =================

    const submitForm = async (data) => {

        setLoading(true);

        try {

            await axiosInstance.put(
                APIPath.UPDATE_CARD(cardId),
                {

                    userId: data.userId,

                    card_number:
                        data.card_number,

                    vip_number:
                        data.vip_number,

                    discount:
                        data.discount,

                    // ================= NEW =================

                    card_type:
                        data.card_type,

                    goldIssued:
                        data.goldIssued,

                    received:
                        data.received,

                    issued_date:
                        data.issued_date,

                    expiration_date:
                        data.expiration_date,

                    plate_number:
                        data.plate_number,

                    vehicle_model:
                        data.vehicle_model,

                    color:
                        data.color,

                    frame_number:
                        data.frame_number,

                    engine_number:
                        data.engine_number,

                    active_point:
                        data.active_point,

                    total_point:
                        data.total_point,

                    running_part:
                        data.running_part,

                    running_labour:
                        data.running_labour,

                    countCard:
                        data.countCard,
                }
            );

            handleFetchCard();

            SuccessAlert(
                t("update_success")
            );

            onClose();

        } catch (error) {

            SuccessAlert(
                t("update_failed"),
                1500,
                "warning"
            );

            console.error(
                "Update card failed:",
                error.response?.data ||
                error.message
            );

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
        users
    };
};