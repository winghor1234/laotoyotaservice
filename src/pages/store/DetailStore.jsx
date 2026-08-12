// import { useParams,useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { Store, Download } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { QRCodeCanvas } from "qrcode.react";
// import Spinner from "../../utils/Loading";
// import { BackButton } from "../../utils/BackButton";
// import APIPath from "../../api/APIPath";
// import axiosInstance from "../../utils/AxiosInstance";
// import { formatDates } from "../../utils/FormatDate";
// import SelectDate from "../../utils/SelectDate";
// import useServerFilterPagination from "../../utils/useServerFilterPagination";

// const DetailStore = () => {
//     const { id } = useParams();
//     const { t } = useTranslation("store");
//     const [store, setStore] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showAddProduct, setShowAddProduct] = useState(false);
//     const qrRef = useRef(null);

//     useEffect(() => {
//         const fetchStore = async () => {
//             try {
//                 const res = await axiosInstance.get(APIPath.SELECT_ONE_STORE(id));
//                 setStore(res?.data?.data);
//             } catch (error) {
//                 console.error("Error loading store details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchStore();
//     }, [id]);

//     const handleDownloadQR = () => {
//         const canvas = qrRef.current?.querySelector("canvas");
//         if (!canvas) return;
//         const url = canvas.toDataURL("image/png");
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `QR_${store.name}.png`;
//         a.click();
//     };

//     const {
//         data: products,
//         page,
//         totalPage,
//         search,
//         handleSearch,
//         handleDateChange,
//         handlePageChange,
//         fetchData,
//         getPageNumbers,
//         totalCount,
//         rangeStart,
//         rangeEnd,
//         inputPage,
//         handleInputPageChange,
//     } = useServerFilterPagination({
//         apiCall: ({ page, limit, search, startDate, endDate }) =>
//             axiosInstance.get(APIPath.GET_ALL_PRODUCTS, {
//                 params: {
//                     page,
//                     limit,
//                     search: search || undefined,
//                     startDate: startDate?.toISOString(),
//                     endDate: endDate?.toISOString(),
//                 },
//             }),
//     });

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-50">
//                 <Spinner size="5" color="red" />
//             </div>
//         );
//     }

//     if (!store) {
//         return (
//             <div className="flex items-center justify-center min-h-screen text-gray-500">
//                 {t("store_not_found")}
//             </div>
//         );
//     }

//     // const qrDiscount = store.qrCode ? (JSON.parse(store.qrCode)?.discount ?? 0) : 0;

//     return (
//         <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
//             <div className="flex justify-end items-center mb-6 gap-3">
//                 <SelectDate
//                     searchValue={search}
//                     onSearchChange={handleSearch}
//                     onDateChange={handleDateChange}
//                 />
//                 <button
//                     onClick={() => setShowAddProduct(true)}
//                     className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base"
//                 >
//                     {t("add_store")}
//                 </button>
//             </div>
//             <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="p-4 sm:p-6">
//                     <BackButton />
//                     <hr className="border-gray-200 my-4" />

//                     <div className="flex flex-col items-center mb-6">
//                         <Store className="text-2xl text-gray-600 w-8 h-8" />
//                         <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
//                             {t("store_detail")}
//                         </h2>
//                     </div>

//                     {store.image && (
//                         <div className="flex justify-center mb-6">
//                             <img
//                                 src={store.image}
//                                 alt={store.name}
//                                 className="w-48 h-48 object-cover rounded-xl border shadow"
//                             />
//                         </div>
//                     )}

//                     <div className="space-y-4 px-2 sm:px-8">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-sm text-gray-500">{t("store_name")}</p>
//                                 <p className="text-base font-semibold text-gray-900 mt-1">{store.name}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-sm text-gray-500">{t("status")}</p>
//                                 <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${store.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                                     {store.status ? t("active") : t("inactive")}
//                                 </span>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-sm text-gray-500">{t("address")}</p>
//                                 <p className="text-base text-gray-800 mt-1">{store.address}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <p className="text-sm text-gray-500">{t("phone")}</p>
//                                 <p className="text-base text-gray-800 mt-1">{store.phone}</p>
//                             </div>
//                             {/* <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
//                                 <p className="text-sm text-gray-500">{t("qr_discount")}</p>
//                                 <p className="text-2xl font-bold text-[#E52020] mt-1">{qrDiscount}%</p>
//                             </div> */}
//                         </div>

//                         {store.qrCode && (
//                             <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center gap-4">
//                                 <p className="text-sm text-gray-500 self-start">{t("qr_code")}</p>
//                                 <div ref={qrRef} className="p-4 bg-white rounded-xl shadow border">
//                                     <QRCodeCanvas
//                                         value={store.qrCode}
//                                         size={200}
//                                         bgColor="#ffffff"
//                                         fgColor="#000000"
//                                         level="H"
//                                     />
//                                 </div>
//                                 <p className="text-xs text-gray-400">{t("qr_scan_hint")}</p>
//                                 <button
//                                     onClick={handleDownloadQR}
//                                     className="flex items-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
//                                 >
//                                     <Download size={16} />
//                                     {t("download_qr")}
//                                 </button>
//                             </div>
//                         )}

//                         <div className="bg-gray-50 p-4 rounded-lg">
//                             <p className="text-sm text-gray-500">{t("created_at")}</p>
//                             <p className="text-base text-gray-800 mt-1">
//                                 {formatDates(store.createdAt)}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DetailStore;


import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Store, Download, Eye, Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";
import { formatDates } from "../../utils/FormatDate";
import SelectDate from "../../utils/SelectDate";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import AddProduct from "./Addproduct";
import EditProduct from "./EditProduct";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import { FormatNumber } from "../../utils/FormatNumber";

const DetailStore = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("store");
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
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

    const {
        data: products,
        page,
        totalPage,
        search,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
        totalCount,
        rangeStart,
        rangeEnd,
        inputPage,
        handleInputPageChange,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) =>
            axiosInstance.get(APIPath.GET_ALL_PRODUCTS, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                    storeId: id,
                },
            }),
    });
    const handleDelete = async (product_id) => {
        try {
            const confirmed = await DeleteAlert(t("delete_product_confirm"), t("delete_success"));
            if (confirmed) {
                await axiosInstance.delete(APIPath.DELETE_PRODUCT(product_id));
                fetchData();
            }
        } catch (error) {
            console.error("Delete Product failed:", error);
            SuccessAlert(t("delete_error"), 1500, "error");
        }
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

    // const qrDiscount = store.qrCode ? (JSON.parse(store.qrCode)?.discount ?? 0) : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            {/* Store detail card */}
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
                            {/* <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                                <p className="text-sm text-gray-500">{t("qr_discount")}</p>
                                <p className="text-2xl font-bold text-[#E52020] mt-1">{qrDiscount}%</p>
                            </div> */}
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
                                {formatDates(store.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product list section */}
            <div className="max-w-6xl mx-auto mt-6">
                <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-800">{t("product_list")}</h3>
                    <div className="flex gap-3 items-center flex-wrap">
                        <SelectDate
                            searchValue={search}
                            onSearchChange={handleSearch}
                            onDateChange={handleDateChange}
                        />
                        <button
                            onClick={() => setShowAddProduct(true)}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base"
                        >
                            {t("add_product")}
                        </button>
                    </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-4 mb-6">
                    {products?.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        products?.map((item, index) => (
                            <div key={item.product_id || index} className="bg-white rounded-lg shadow-md p-4">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-lg mb-3" />
                                )}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.price}</p>
                                        <p className="text-sm text-gray-500">{t("quantity")}: {item.quantity}</p>
                                        <span className={`px-2 py-0.5 rounded-full mt-1 inline-block text-xs ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {item.status ? t("active") : t("inactive")}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Eye
                                            className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                            onClick={() => navigate(`/user/product-detail/${item.product_id}`)}
                                        />
                                        <Edit
                                            className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                            onClick={() => {
                                                setSelectedProduct(item.product_id);
                                                setShowEditProduct(true);
                                            }}
                                        />
                                        <Trash
                                            className="text-gray-600 w-4 h-4 hover:text-red-600 cursor-pointer"
                                            onClick={() => handleDelete(item.product_id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                    <div className="w-full h-12 md:h-12 lg:h-14 bg-[#E52020] text-white">
                        <div className="grid grid-cols-7 gap-3 px-4 lg:px-6 py-3 md:py-4 font-medium">
                            <div className="text-center">{t("index")}</div>
                            <div className="text-center">{t("product_image")}</div>
                            <div className="text-center">{t("product_name")}</div>
                            <div className="text-center">{t("product_amount")}</div>
                            <div className="text-center">{t("product_price")}</div>
                            <div className="text-center">{t("product_status")}</div>
                            <div className="text-center">{t("action")}</div>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                        {products?.length === 0 ? (
                            <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                        ) : (
                            products?.map((item, index) => (
                                <div
                                    key={item.product_id || index}
                                    className="grid grid-cols-7 gap-3 px-3 lg:px-4 py-3 lg:py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer"
                                    
                                >
                                    <div className="text-center">{index + 1}</div>
                                    <div className="flex justify-center">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                        )}
                                    </div>
                                    <div className="text-center line-clamp-1">{item.name}</div>
                                    <div className="text-center">{item.amount}</div>
                                    <div className="text-center">{FormatNumber(item.price)} {t("kip")}</div>
                                    <div className="text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {item.status ? t("active") : t("inactive")}
                                        </span>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <Eye
                                            className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/user/product-detail/${item.product_id}`);
                                            }}
                                        />
                                        <Edit
                                            className="text-gray-600 w-4 h-4 hover:text-gray-800 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(item.product_id);
                                                setShowEditProduct(true);
                                            }}
                                        />
                                        <Trash
                                            className="text-gray-600 w-4 h-4 hover:text-red-600 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.product_id);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">
                    <div className="text-sm text-gray-500">
                        {t("item_range")} <span className="font-semibold text-gray-700">{rangeStart} - {rangeEnd}</span> {t("from")} <span className="font-semibold text-gray-700">{totalCount}</span> {t("item_range")}
                    </div>
                    <div className="flex gap-4 items-center flex-wrap">
                        <span className="text-sm text-gray-500">{t("to")}:</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPage}
                            value={inputPage}
                            onChange={(e) => handleInputPageChange(e.target.value)}
                            className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <span className="text-sm text-gray-500">{t("of")} {totalPage}</span>
                        <button onClick={() => handlePageChange(1)} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>‹‹</button>
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>‹</button>
                        {getPageNumbers().map((p) => (
                            <button key={p} onClick={() => handlePageChange(p)} className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{p}</button>
                        ))}
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPage || totalPage === 0} className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>›</button>
                        <button onClick={() => handlePageChange(totalPage)} disabled={page === totalPage || totalPage === 0} className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}>››</button>
                    </div>
                </div>
            </div>

            <AddProduct show={showAddProduct} onClose={() => setShowAddProduct(false)} store_id={id} handleFetchProduct={fetchData} />
            <EditProduct show={showEditProduct} onClose={() => setShowEditProduct(false)} product_id={selectedProduct} handleFetchProduct={fetchData} />

        </div>
    );
};

export default DetailStore;