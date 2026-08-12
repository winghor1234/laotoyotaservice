import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";
import { formatDates } from "../../utils/FormatDate";

const ProductDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation("store");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_PRODUCT(id));
                setProduct(res?.data?.data);
            } catch (error) {
                console.error("Error loading product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="5" color="red" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("product_not_found")}
            </div>
        );
    }

    const finalPrice = product.price - ((product.price * (product.discount || 0)) / 100);

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <BackButton />
                    <hr className="border-gray-200 my-4" />

                    <div className="flex flex-col items-center mb-6">
                        <Package className="text-2xl text-gray-600 w-8 h-8" />
                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                            {t("product_detail")}
                        </h2>
                    </div>

                    {product.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-48 h-48 object-cover rounded-xl border shadow"
                            />
                        </div>
                    )}

                    <div className="space-y-4 px-2 sm:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                                <p className="text-sm text-gray-500">{t("product_name")}</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">{product.name}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("status")}</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${product.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {product.status ? t("active") : t("inactive")}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("product_amount")}</p>
                                <p className="text-base text-gray-800 mt-1">{product.amount}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("product_price")}</p>
                                <p className="text-base text-gray-800 mt-1">
                                    {Number(product.price).toLocaleString()} {t("kip")}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("discount")}</p>
                                <p className="text-base text-gray-800 mt-1">{product.discount || 0}%</p>
                            </div>
                        </div>

                        {product.discount > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                                <p className="text-sm text-gray-500">{t("final_price")}</p>
                                <p className="text-2xl font-bold text-[#E52020] mt-1">
                                    {finalPrice.toLocaleString()} {t("kip")}
                                </p>
                            </div>
                        )}

                        {product.store?.name && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">{t("store_name")}</p>
                                <p className="text-base text-gray-800 mt-1">{product.store.name}</p>
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">{t("created_at")}</p>
                            <p className="text-base text-gray-800 mt-1">
                                {formatDates(product.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;