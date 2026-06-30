import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Store, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";

const DetailStore = () => {
    const { id } = useParams();
    const { t } = useTranslation("store");
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const qrRef = useRef(null);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_STORE(id));
                setStore(res?.data?.data);
            } catch (error) {
                console.error("Error loading store details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id]);

    const handleDownloadQR = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${store.name}.png`;
        a.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="5" color="red" />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("store_not_found")}
            </div>
        );
    }

    const qrDiscount = store.qrCode ? (JSON.parse(store.qrCode)?.discount ?? 0) : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <BackButton />
                    <hr className="border-gray-200 my-4" />

                    <div className="flex flex-col items-center mb-6">
                        <Store className="text-2xl text-gray-600 w-8 h-8" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                            {t("store_detail")}
                        </h2>
                    </div>

                    {store.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={store.image}
                                alt={store.name}
                                className="w-48 h-48 object-cover rounded-xl border shadow"
                            />
                        </div>
                    )}

                    <div className="space-y-4 px-2 sm:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("store_name")}</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">{store.name}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("status")}</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${store.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {store.status ? t("active") : t("inactive")}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("address")}</p>
                                <p className="text-base text-gray-800 mt-1">{store.address}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("phone")}</p>
                                <p className="text-base text-gray-800 mt-1">{store.phone}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                                <p className="text-sm text-gray-500">{t("qr_discount")}</p>
                                <p className="text-2xl font-bold text-[#E52020] mt-1">{qrDiscount}%</p>
                            </div>
                        </div>

                        {store.qrCode && (
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center gap-4">
                                <p className="text-sm text-gray-500 self-start">{t("qr_code")}</p>
                                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow border">
                                    <QRCodeCanvas
                                        value={store.qrCode}
                                        size={200}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="H"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">{t("qr_scan_hint")}</p>
                                <button
                                    onClick={handleDownloadQR}
                                    className="flex items-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    <Download size={16} />
                                    {t("download_qr")}
                                </button>
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">{t("created_at")}</p>
                            <p className="text-base text-gray-800 mt-1">
                                {new Date(store.createdAt).toLocaleDateString("lo-LA", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailStore;
