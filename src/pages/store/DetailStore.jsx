// import { useParams } from "react-router-dom";
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
// // import useServerFilterPagination from "../../utils/useServerFilterPagination";

// const DetailStore = () => {
//     const { id } = useParams();
//     const { t } = useTranslation("store");
//     const [store, setStore] = useState(null);
//     const [loading, setLoading] = useState(true);
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


// import { useParams } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import {
//     Store,
//     Download,
//     MapPin,
//     ExternalLink,
// } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { QRCodeCanvas } from "qrcode.react";
// import Spinner from "../../utils/Loading";
// import { BackButton } from "../../utils/BackButton";
// import APIPath from "../../api/APIPath";
// import axiosInstance from "../../utils/AxiosInstance";
// import { formatDates } from "../../utils/FormatDate";

// const DetailStore = () => {
//     const { id } = useParams();
//     const { t } = useTranslation("store");

//     const [store, setStore] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const qrRef = useRef(null);

//     // ============================================
//     // Fetch Store Detail
//     // ============================================
//     useEffect(() => {
//         const fetchStore = async () => {
//             try {
//                 setLoading(true);

//                 const res = await axiosInstance.get(
//                     APIPath.SELECT_ONE_STORE(id)
//                 );

//                 setStore(res?.data?.data || null);
//             } catch (error) {
//                 console.error(
//                     "Error loading store details:",
//                     error
//                 );

//                 setStore(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchStore();
//         }
//     }, [id]);

//     // ============================================
//     // Download QR Code
//     // ============================================
//     const handleDownloadQR = () => {
//         const canvas = qrRef.current?.querySelector("canvas");

//         if (!canvas || !store?.name) {
//             return;
//         }

//         try {
//             const url = canvas.toDataURL("image/png");

//             const a = document.createElement("a");

//             a.href = url;
//             a.download = `QR_${store.name}.png`;

//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//         } catch (error) {
//             console.error(
//                 "Download QR failed:",
//                 error
//             );
//         }
//     };

//     // ============================================
//     // Check Store Location
//     // ============================================
//     const hasLocation =
//         store?.latitude !== null &&
//         store?.latitude !== undefined &&
//         store?.latitude !== "" &&
//         store?.longitude !== null &&
//         store?.longitude !== undefined &&
//         store?.longitude !== "";

//     // ============================================
//     // Open Google Maps
//     // ============================================
//     const handleViewLocation = () => {
//         if (!hasLocation) {
//             return;
//         }

//         const latitude = Number(store.latitude);
//         const longitude = Number(store.longitude);

//         // Validate coordinate
//         if (
//             Number.isNaN(latitude) ||
//             Number.isNaN(longitude)
//         ) {
//             console.error("Invalid store location");
//             return;
//         }

//         if (
//             latitude < -90 ||
//             latitude > 90 ||
//             longitude < -180 ||
//             longitude > 180
//         ) {
//             console.error("Store location is out of range");
//             return;
//         }

//         const googleMapsUrl =
//             `https://www.google.com/maps?q=${latitude},${longitude}`;

//         window.open(
//             googleMapsUrl,
//             "_blank",
//             "noopener,noreferrer"
//         );
//     };

//     // ============================================
//     // Loading
//     // ============================================
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-50">
//                 <Spinner
//                     size="5"
//                     color="red"
//                 />
//             </div>
//         );
//     }

//     // ============================================
//     // Store Not Found
//     // ============================================
//     if (!store) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 px-4">
//                 <Store
//                     size={40}
//                     className="text-gray-300 mb-3"
//                 />

//                 <p className="text-sm sm:text-base">
//                     {t("store_not_found")}
//                 </p>
//             </div>
//         );
//     }

//     // ============================================
//     // Render
//     // ============================================
//     return (
//         <div className="min-h-screen bg-gray-50 p-2 sm:p-4">

//             {/* ============================================
//                 Store Detail Card
//             ============================================ */}
//             <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

//                 <div className="p-4 sm:p-6">

//                     {/* Back */}
//                     <BackButton />

//                     <hr className="border-gray-200 my-4" />

//                     {/* Header */}
//                     <div className="flex flex-col items-center mb-6">

//                         <Store
//                             className="text-gray-600"
//                             size={32}
//                         />

//                         <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
//                             {t("store_detail")}
//                         </h2>
//                     </div>

//                     {/* ============================================
//                         Store Image
//                     ============================================ */}
//                     {store.image && (
//                         <div className="flex justify-center mb-6">

//                             <img
//                                 src={store.image}
//                                 alt={store.name}
//                                 className="w-48 h-48 object-cover rounded-xl border shadow"
//                             />

//                         </div>
//                     )}

//                     {/* ============================================
//                         Store Information
//                     ============================================ */}
//                     <div className="space-y-4 px-2 sm:px-8">

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//                             {/* Store Name */}
//                             <div className="bg-gray-50 p-4 rounded-lg">

//                                 <p className="text-sm text-gray-500">
//                                     {t("store_name")}
//                                 </p>

//                                 <p className="text-base font-semibold text-gray-900 mt-1 break-words">
//                                     {store.name}
//                                 </p>

//                             </div>

//                             {/* Status */}
//                             <div className="bg-gray-50 p-4 rounded-lg">

//                                 <p className="text-sm text-gray-500">
//                                     {t("status")}
//                                 </p>

//                                 <span
//                                     className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${store.status
//                                             ? "bg-green-100 text-green-700"
//                                             : "bg-red-100 text-red-700"
//                                         }`}
//                                 >
//                                     {store.status
//                                         ? t("active")
//                                         : t("inactive")}
//                                 </span>

//                             </div>

//                             {/* Address */}
//                             <div className="bg-gray-50 p-4 rounded-lg">

//                                 <p className="text-sm text-gray-500">
//                                     {t("address")}
//                                 </p>

//                                 <p className="text-base text-gray-800 mt-1 break-words">
//                                     {store.address}
//                                 </p>

//                             </div>

//                             {/* Phone */}
//                             <div className="bg-gray-50 p-4 rounded-lg">

//                                 <p className="text-sm text-gray-500">
//                                     {t("phone")}
//                                 </p>

//                                 <p className="text-base text-gray-800 mt-1 break-words">
//                                     {store.phone}
//                                 </p>

//                             </div>

//                         </div>

//                         {/* ============================================
//                             Location
//                         ============================================ */}
//                         <div className="bg-gray-50 p-4 rounded-lg">

//                             <div className="flex items-center gap-2 mb-4">

//                                 <MapPin
//                                     size={20}
//                                     className="text-[#E52020]"
//                                 />

//                                 <p className="text-sm font-medium text-gray-700">
//                                     {t("location") || "Location"}
//                                 </p>

//                             </div>

//                             {hasLocation ? (
//                                 <div className="space-y-4">

//                                     {/* Coordinates */}
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

//                                         {/* Latitude */}
//                                         <div className="bg-white border border-gray-200 rounded-lg p-3">

//                                             <p className="text-xs text-gray-500">
//                                                 Latitude
//                                             </p>

//                                             <p className="text-sm font-medium text-gray-800 mt-1 break-all">
//                                                 {String(store.latitude)}
//                                             </p>

//                                         </div>

//                                         {/* Longitude */}
//                                         <div className="bg-white border border-gray-200 rounded-lg p-3">

//                                             <p className="text-xs text-gray-500">
//                                                 Longitude
//                                             </p>

//                                             <p className="text-sm font-medium text-gray-800 mt-1 break-all">
//                                                 {String(store.longitude)}
//                                             </p>

//                                         </div>

//                                     </div>

//                                     {/* View Google Maps */}
//                                     <button
//                                         type="button"
//                                         onClick={handleViewLocation}
//                                         className="w-full flex items-center justify-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer"
//                                     >

//                                         <MapPin size={18} />

//                                         <span>
//                                             {t("view_location") ||
//                                                 "View Location"}
//                                         </span>

//                                         <ExternalLink size={16} />

//                                     </button>

//                                 </div>
//                             ) : (
//                                 /* No Location */
//                                 <div className="flex flex-col items-center justify-center py-6 text-center">

//                                     <MapPin
//                                         size={32}
//                                         className="text-gray-300 mb-2"
//                                     />

//                                     <p className="text-sm text-gray-400">
//                                         {t("location_not_available") ||
//                                             "Location not available"}
//                                     </p>

//                                 </div>
//                             )}

//                         </div>

//                         {/* ============================================
//                             QR Code
//                         ============================================ */}
//                         {store.qrCode && (
//                             <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center gap-4">

//                                 <p className="text-sm text-gray-500 self-start">
//                                     {t("qr_code")}
//                                 </p>

//                                 <div
//                                     ref={qrRef}
//                                     className="p-4 bg-white rounded-xl shadow border"
//                                 >

//                                     <QRCodeCanvas
//                                         value={store.qrCode}
//                                         size={200}
//                                         bgColor="#ffffff"
//                                         fgColor="#000000"
//                                         level="H"
//                                     />

//                                 </div>

//                                 <p className="text-xs text-gray-400 text-center">
//                                     {t("qr_scan_hint")}
//                                 </p>

//                                 <button
//                                     type="button"
//                                     onClick={handleDownloadQR}
//                                     className="flex items-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
//                                 >

//                                     <Download size={16} />

//                                     {t("download_qr")}

//                                 </button>

//                             </div>
//                         )}

//                         {/* ============================================
//                             Created At
//                         ============================================ */}
//                         <div className="bg-gray-50 p-4 rounded-lg">

//                             <p className="text-sm text-gray-500">
//                                 {t("created_at")}
//                             </p>

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


import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { Store, Download, MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";
import { formatDates } from "../../utils/FormatDate";

/* =========================================================
   Fix Leaflet Default Marker Icon
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   Helpers
========================================================= */

const isValidCoordinate = (latitude, longitude) =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

const isEmptyValue = (value) =>
    value === null || value === undefined || String(value).trim() === "";

const DetailStore = () => {
    const { id } = useParams();
    const { t } = useTranslation("store");

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    const qrRef = useRef(null);

    // ============================================
    // Fetch Store Detail
    // ============================================
    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true);

                const res = await axiosInstance.get(
                    APIPath.SELECT_ONE_STORE(id)
                );

                setStore(res?.data?.data || null);
            } catch (error) {
                console.error("Error loading store details:", error);
                setStore(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStore();
        }
    }, [id]);

    // ============================================
    // Store Location (valid coordinates only)
    // ============================================
    const locationPosition = useMemo(() => {
        if (!store) return null;

        if (isEmptyValue(store.latitude) || isEmptyValue(store.longitude)) {
            return null;
        }

        const latitude = Number(store.latitude);
        const longitude = Number(store.longitude);

        return isValidCoordinate(latitude, longitude)
            ? [latitude, longitude]
            : null;
    }, [store]);

    const hasLocation = locationPosition !== null;

    // ============================================
    // Download QR Code
    // ============================================
    const handleDownloadQR = () => {
        const canvas = qrRef.current?.querySelector("canvas");

        if (!canvas || !store?.name) {
            return;
        }

        try {
            const url = canvas.toDataURL("image/png");

            const a = document.createElement("a");

            a.href = url;
            a.download = `QR_${store.name}.png`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download QR failed:", error);
        }
    };

    // ============================================
    // Open Google Maps
    // ============================================
    const handleViewLocation = () => {
        if (!locationPosition) {
            return;
        }

        const [latitude, longitude] = locationPosition;

        const googleMapsUrl =
            `https://www.google.com/maps/search/?api=1` +
            `&query=${encodeURIComponent(`${latitude},${longitude}`)}`;

        window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    };

    // ============================================
    // Loading
    // ============================================
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="5" color="red" />
            </div>
        );
    }

    // ============================================
    // Store Not Found
    // ============================================
    if (!store) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 px-4">
                <Store size={40} className="text-gray-300 mb-3" />

                <p className="text-sm sm:text-base">{t("store_not_found")}</p>
            </div>
        );
    }

    // ============================================
    // Render
    // ============================================
    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            {/* ============================================
                Store Detail Card
            ============================================ */}
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    {/* Back */}
                    <BackButton />

                    <hr className="border-gray-200 my-4" />

                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <Store className="text-gray-600" size={32} />

                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                            {t("store_detail")}
                        </h2>
                    </div>

                    {/* ============================================
                        Store Image
                    ============================================ */}
                    {store.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={store.image}
                                alt={store.name}
                                className="w-48 h-48 object-cover rounded-xl border shadow"
                            />
                        </div>
                    )}

                    {/* ============================================
                        Store Information
                    ============================================ */}
                    <div className="space-y-4 px-2 sm:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Store Name */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    {t("store_name")}
                                </p>

                                <p className="text-base font-semibold text-gray-900 mt-1 break-words">
                                    {store.name}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    {t("status")}
                                </p>

                                <span
                                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${store.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {store.status ? t("active") : t("inactive")}
                                </span>
                            </div>

                            {/* Address */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    {t("address")}
                                </p>

                                <p className="text-base text-gray-800 mt-1 break-words">
                                    {store.address}
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    {t("phone")}
                                </p>

                                <p className="text-base text-gray-800 mt-1 break-words">
                                    {store.phone}
                                </p>
                            </div>
                        </div>

                        {/* ============================================
                            Location
                        ============================================ */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={20} className="text-[#E52020]" />

                                <p className="text-sm font-medium text-gray-700">
                                    {t("location") || "Location"}
                                </p>
                            </div>

                            {hasLocation ? (
                                <div className="space-y-4">
                                    {/* Map (read-only view) */}
                                    <div className="w-full h-[260px] sm:h-[320px] rounded-lg overflow-hidden border border-gray-200 bg-white">
                                        <MapContainer
                                            key={`${locationPosition[0]},${locationPosition[1]}`}
                                            center={locationPosition}
                                            zoom={16}
                                            scrollWheelZoom={false}
                                            className="w-full h-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker position={locationPosition}>
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-semibold mb-1 break-words">
                                                            {store.name}
                                                        </p>

                                                        {store.address && (
                                                            <p className="mb-1 break-words">
                                                                {store.address}
                                                            </p>
                                                        )}

                                                        <p>
                                                            {t("Latitude")}:{" "}
                                                            {locationPosition[0].toFixed(6)}
                                                        </p>

                                                        <p>
                                                            {t("Longitude")}:{" "}
                                                            {locationPosition[1].toFixed(6)}
                                                        </p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>

                                    {/* Coordinates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Latitude */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">
                                                {t("Latitude")}
                                            </p>

                                            <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                                                {String(store.latitude)}
                                            </p>
                                        </div>

                                        {/* Longitude */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">
                                                {t("Longitude")}
                                            </p>

                                            <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                                                {String(store.longitude)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* View Google Maps */}
                                    <button
                                        type="button"
                                        onClick={handleViewLocation}
                                        className="w-full flex items-center justify-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        <MapPin size={18} />

                                        <span>
                                            {t("view_location") || "View Location"}
                                        </span>

                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            ) : (
                                /* No Location */
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <MapPin
                                        size={32}
                                        className="text-gray-300 mb-2"
                                    />

                                    <p className="text-sm text-gray-400">
                                        {t("location_not_available") ||
                                            "Location not available"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ============================================
                            QR Code
                        ============================================ */}
                        {store.qrCode && (
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center gap-4">
                                <p className="text-sm text-gray-500 self-start">
                                    {t("qr_code")}
                                </p>

                                <div
                                    ref={qrRef}
                                    className="p-4 bg-white rounded-xl shadow border"
                                >
                                    <QRCodeCanvas
                                        value={store.qrCode}
                                        size={200}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="H"
                                    />
                                </div>

                                <p className="text-xs text-gray-400 text-center">
                                    {t("qr_scan_hint")}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleDownloadQR}
                                    className="flex items-center gap-2 bg-[#E52020] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                >
                                    <Download size={16} />

                                    {t("download_qr")}
                                </button>
                            </div>
                        )}

                        {/* ============================================
                            Created At
                        ============================================ */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">
                                {t("created_at")}
                            </p>

                            <p className="text-base text-gray-800 mt-1">
                                {formatDates(store.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailStore;