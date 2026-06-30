import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";

const DetailTransaction = () => {
    const { id } = useParams();
    const { t } = useTranslation("store");
    const [txn, setTxn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTxn = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_TRANSACTION(id));
                setTxn(res?.data?.data);
            } catch (error) {
                console.error("Error loading transaction:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTxn();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="5" color="red" />
            </div>
        );
    }

    if (!txn) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("transaction_not_found")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <BackButton />
                    <hr className="border-gray-200 my-4" />

                    <div className="flex flex-col items-center mb-6">
                        <ArrowLeftRight className="w-8 h-8 text-gray-600" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                            {t("transaction_detail")}
                        </h2>
                    </div>

                    <div className="space-y-4 px-2 sm:px-8">
                        <div className="bg-[#E52020] text-white p-4 rounded-lg text-center">
                            <p className="text-sm opacity-80">{t("transaction_code")}</p>
                            <p className="text-xl font-bold font-mono mt-1">{txn.code}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("customer")}</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">{txn.card?.user?.username || "-"}</p>
                                <p className="text-sm text-gray-500">{txn.card?.user?.phoneNumber || ""}</p>
                                <p className="text-xs text-gray-400 mt-1">{t("card_number")}: {txn.card?.card_number || "-"}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("store")}</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">{txn.store?.name || "-"}</p>
                                <p className="text-sm text-gray-500">{txn.store?.address || ""}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("discount_received")}</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{txn.discount}%</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("date_time")}</p>
                                <p className="text-base text-gray-800 mt-1">
                                    {new Date(txn.createdAt).toLocaleDateString("lo-LA", {
                                        year: "numeric", month: "long", day: "numeric"
                                    })}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(txn.createdAt).toLocaleTimeString("lo-LA")}
                                </p>
                            </div>
                        </div>

                        {txn.store?.image && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">{t("store_image")}</p>
                                <img
                                    src={txn.store.image}
                                    alt={txn.store.name}
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailTransaction;
