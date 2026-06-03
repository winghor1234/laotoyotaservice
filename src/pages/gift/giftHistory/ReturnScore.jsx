

import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    amount: z.number().min(0, "Amount must be at least 0"),
});

const ReturnScore = ({ show, onClose, id, handleFetch }) => {
    const { t } = useTranslation("gift");
    const [loading, setLoading] = useState(false);
    const [giftHistoryData, setGiftHistoryData] = useState({});

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 0,
        },
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(APIPath.DELETE_GIFT_HISTORY(id));
                const data = res?.data?.data;
                setGiftHistoryData(data);
                setValue("amount", data?.amount || 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleReturnScore = async (formData) => {
        try {
            setLoading(true);
            await axiosInstance.put(APIPath.UPDATE_GIFT_HISTORY(id), {
                amount: formData.amount,
            });
            handleFetch();
            onClose();
            SuccessAlert(t("return_score_gift_success"));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            {/* BACKDROP */}
            <div
                className="fixed inset-0 backdrop-brightness-50 z-40"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">

                <h2 className="text-lg font-semibold text-center mb-6">
                    {t("return_score_gift")}
                </h2>

                <form
                    onSubmit={handleSubmit(handleReturnScore)}
                    className="space-y-6"
                >

                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* CUSTOMER (DISPLAY ONLY - NO INPUT STYLE) */}
                        <div>
                            <label className="text-sm text-gray-500">
                                {t("customer_name")}
                            </label>
                            <p className="mt-1 text-gray-800">
                                {giftHistoryData?.user?.username || "-"}
                            </p>
                        </div>

                        {/* GIFT */}
                        <div>
                            <label className="text-sm text-gray-500">
                                {t("gift_name")}
                            </label>
                            <p className="mt-1 text-gray-800">
                                {giftHistoryData?.giftcard?.gift_Name || "-"}
                            </p>
                        </div>

                        {/* AMOUNT (ONLY INPUT) */}
                        <div>
                            <label className="text-sm text-gray-500">
                                {t("amount")}
                            </label>

                            <input
                                type="number"
                                {...register("amount", { valueAsNumber: true })}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none
                                focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />

                            {errors.amount && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>

                        {/* POINT */}
                        <div>
                            <label className="text-sm text-gray-500">
                                {t("gift_one_point")}
                            </label>
                            <p className="mt-1 text-gray-800">
                                {giftHistoryData?.giftcard?.gift_Point || 0}
                            </p>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-center gap-4 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 w-28 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 w-28 rounded-lg bg-green-500 text-white hover:bg-green-600 transition flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Spinner size="5" color="white" />}
                            {t("submit")}
                        </button>

                    </div>

                </form>
            </div>
        </>
    );
};

export default ReturnScore;