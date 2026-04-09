import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import { useEffect } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useState } from "react";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";


const ReturnScore = ({ show, onClose, id, handleFetch }) => {
    const { t } = useTranslation("gift");
    const [loading, setLoading] = useState(false);
    const [giftHistoryData, setGiftHistoryData] = useState({});

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_GIFT_HISTORY(id));
                setGiftHistoryData(res?.data?.data);
            } catch (error) {
                console.error("Error loading gift history details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleReturnScore = async (id) => {
        try {
            // console.log("giftHistoryData id : ", id);
            await axiosInstance.put(APIPath.DELETE_GIFT_HISTORY(id));
            handleFetch();
            onClose();
            SuccessAlert(t("return_score_gift_success"));
        } catch (error) {
            console.error("Error returning score:", error);
        }
    };

    if (!show) return null;


    return (
        <>
            <div
                className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{t("return_score_gift")}</h2>

                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4 ">
                        <div className="flex flex-col justify-center items-center">
                            <label htmlFor="giftName">{t("customer_name")}</label>
                            <div className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors" >
                                {giftHistoryData?.user?.username}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <label htmlFor="giftName">{t("gift_name")}</label>
                            <div className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors" >
                                {giftHistoryData?.giftcard?.name}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <label htmlFor="amount">{t("amount")}</label>
                            <div className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors" >
                                {giftHistoryData?.amount}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <label htmlFor="total">{t("total_point")}</label>
                            <div className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors" >
                                {giftHistoryData?.total}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
                            disabled={loading}
                            onClick={() => handleReturnScore(giftHistoryData?.gifthistory_id)}
                        >
                            {loading ? <Spinner size="5" color="white" /> : null}
                            {t("submit")}
                        </button>
                    </div>
                </div >
            </div >
        </>
    );
};

export default ReturnScore;
