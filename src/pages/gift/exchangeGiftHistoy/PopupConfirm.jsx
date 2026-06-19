import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useState } from "react";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

const Confirm = ({ show, onClose, Id , handleFetch}) => {
    const { t } = useTranslation("gift");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetchData = async (giftId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                APIPath.SELECT_ONE_GIFT_HISTORY(giftId)
            );
            setData(res?.data?.data || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            setLoading(true);
            await axiosInstance.put(APIPath.CONFIRM_GIFT_HISTORY(id));
            SuccessAlert(t("confirm_success"), 1500, "success");
            onClose();
            handleFetch();
        } catch (error) {
            const message = error.response?.data?.message == "Point Not Enough" ? t("point_not_enough") : error.response?.data?.message;
            SuccessAlert( message, 1500, "warning");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!show || !Id) return;

        handleFetchData(Id);
    }, [show, Id]);

    // reset when close
    useEffect(() => {
        if (!show) {
            setData(null);
        }
    }, [show]);
    if (!show) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className=" fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm">

                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
                    {t("confirm_gift_history-detail")}
                </h2>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner size="6" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_title")}</p>
                                <p className="font-semibold text-gray-900">
                                    {data?.giftcard?.gift_Name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_amount")}</p>
                                <p className="text-gray-800">
                                    {data?.amount || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_one_point")}</p>
                                <p className="text-gray-800">
                                    {data?.giftcard?.gift_Point || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_user_name")}</p>
                                <p className="text-gray-800">
                                    {data?.user?.username || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_card_number")}</p>
                                <p className="text-gray-800 break-all">
                                    {data?.card_number || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_user_phone")}</p>
                                <p className="text-gray-800">
                                    {data?.user?.phoneNumber || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_user_province")}</p>
                                <p className="text-gray-800">
                                    {data?.user?.province || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t("gift_user_village")}</p>
                                <p className="text-gray-800">
                                    {data?.user?.village || "-"}
                                </p>
                            </div>
                        </div>

                        {/* image safe check */}
                        {data?.giftcard?.image && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={data.giftcard.image}
                                    alt="Gift"
                                    className="w-[200px] h-[200px] object-cover rounded-lg shadow"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10"
                            >
                                {t("cancel")}
                            </button>

                            <button
                                onClick={() => handleConfirm(data?.gifthistory_id)}
                                type="button"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10"
                            >
                                {t("confirm")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Confirm;