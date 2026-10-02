// // src/pages/branch/DetailBranchPage.jsx
// import { FaBuilding } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Spinner from "../../utils/Loading";
// import { BackButton } from "../../utils/BackButton";
// import APIPath from "../../api/APIPath";
// import { useTranslation } from "react-i18next";
// import axiosInstance from "../../utils/AxiosInstance";

// const DetailBranch = () => {
//     const { t } = useTranslation("branch");
//     const { id } = useParams();
//     const [branchData, setBranchData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBranch = async () => {
//             try {
//                 const res = await axiosInstance.get(APIPath.SELECT_ONE_BRANCH(id));
//                 setBranchData(res?.data?.data);
//             } catch (error) {
//                 console.error("Error loading branch details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchBranch();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-50">
//                 <Spinner size="lg" text={t("loading_data")} />
//             </div>
//         );
//     }

//     if (!branchData) {
//         return (
//             <div className="flex items-center justify-center min-h-screen text-gray-500">
//                 {t("no_data")}
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
//             <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="p-4 sm:p-6">
//                     <BackButton />
//                     <hr className="border-gray-200 my-4" />
//                     <div className="flex flex-col items-center mb-6">
//                         <FaBuilding className="text-2xl text-gray-600" />
//                         <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-6">
//                             {t("branch_detail")}
//                         </h2>
//                     </div>

//                     {/* Desktop / Tablet View */}
//                     <div className="hidden md:block px-16">
//                         <div className="flex gap-6 items-start justify-start p-4 rounded-lg shadow-sm">
//                             <div className="flex flex-col gap-2 text-left">
//                                 <div>
//                                     <p className="text-base text-gray-500">{t("branch_title")} :</p>
//                                     <p className="text-base text-gray-900 font-semibold">{branchData.branch_name}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-base text-gray-500">{t("branch_location")} :</p>
//                                     <p className="text-base text-gray-800">{branchData.location}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-base text-gray-500">{t("branch_phone")} :</p>
//                                     <p className="text-base text-gray-800">{branchData.phone}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Mobile View */}
//                     <div className="md:hidden space-y-4">
//                         {/* <div className="flex flex-col items-center gap-3">
//                             <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full shadow">
//                                 <FaBuilding className="text-xl text-gray-600" />
//                             </div>
//                             <p className="text-base text-gray-500">{t("branch_details")}</p>
//                         </div> */}
//                         <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3">
//                             <div>
//                                 <span className="text-base text-gray-500 block">{t("branch_title")}:</span>
//                                 <span className="text-base font-medium text-gray-900">{branchData.branch_name}</span>
//                             </div>
//                             <div>
//                                 <span className="text-base text-gray-500 block">{t("branch_location")}:</span>
//                                 <span className="text-base font-medium text-gray-800">{branchData.location}</span>
//                             </div>
//                             <div>
//                                 <span className="text-base text-gray-500 block">{t("branch_phone")}:</span>
//                                 <span className="text-base font-medium text-gray-800">{branchData.phone}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DetailBranch;




// src/pages/branch/DetailBranchPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBuilding } from "react-icons/fa";
import { MapPin, ExternalLink } from "lucide-react";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import APIPath from "../../api/APIPath";
import axiosInstance from "../../utils/AxiosInstance";
import { MapContainer, TileLayer, Marker, Popup, } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DetailBranch = () => {
    const { t } = useTranslation("branch");
    const { id } = useParams();
    const [branchData, setBranchData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(APIPath.SELECT_ONE_BRANCH(id));
                setBranchData(res?.data?.data || null);
            } catch (error) {
                console.error("Error loading branch details:", error);
                setBranchData(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchBranch();
        }
    }, [id]);

    // ----------------------------------------
    // Loading
    // ----------------------------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading_data")} />
            </div>
        );
    }

    // ----------------------------------------
    // No data
    // ----------------------------------------
    if (!branchData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                {t("no_data")}
            </div>
        );
    }

    // ----------------------------------------
    // Coordinates
    // ----------------------------------------
    const latitude = Number(branchData.latitude);
    const longitude = Number(branchData.longitude);

    const hasCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    // ----------------------------------------
    // Google Maps URL
    // ----------------------------------------
    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`
        : null;

    const openGoogleMaps = () => {
        if (!googleMapsUrl) return;

        window.open(
            googleMapsUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">

                    {/* Back */}
                    <BackButton />

                    <hr className="border-gray-200 my-4" />

                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                            <FaBuilding className="text-2xl text-[#E52020]" />
                        </div>

                        <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800">
                            {t("branch_detail")}
                        </h2>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block px-4 lg:px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Branch Information */}
                            <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-800 mb-5">
                                    {t("branch_detail")}
                                </h3>

                                <div className="space-y-5">

                                    {/* Branch Name */}
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {t("branch_title")}
                                        </p>

                                        <p className="text-base text-gray-900 font-semibold">
                                            {branchData.branch_name || "-"}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin
                                                size={16}
                                                className="text-[#E52020]"
                                            />

                                            <p className="text-sm text-gray-500">
                                                {t("branch_location")}
                                            </p>
                                        </div>

                                        <p className="text-base text-gray-800 leading-relaxed">
                                            {branchData.location || "-"}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {t("branch_phone")}
                                        </p>

                                        <p className="text-base text-gray-800">
                                            {branchData.phone || "-"}
                                        </p>
                                    </div>

                                    {/* Coordinates */}
                                    {hasCoordinates && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {t("Coordinates")}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">
                                                        {t("Latitude")}
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                                        {latitude.toFixed(6)}
                                                    </p>
                                                </div>

                                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">
                                                        {t("Longitude")}
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                                        {longitude.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Google Maps */}
                                    {hasCoordinates && (
                                        <button
                                            type="button"
                                            onClick={openGoogleMaps}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E52020] hover:bg-red-700 text-white text-sm font-medium transition"
                                        >
                                            <MapPin size={17} />

                                            {t("open_google_maps")}

                                            <ExternalLink size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                                <div className="flex items-center gap-2 px-2 pb-3">
                                    <MapPin
                                        size={18}
                                        className="text-[#E52020]"
                                    />

                                    <h3 className="text-base font-semibold text-gray-800">
                                        {t("location")}
                                    </h3>
                                </div>

                                {hasCoordinates ? (
                                    <div className="w-full h-[360px] overflow-hidden rounded-lg">
                                        <MapContainer
                                            center={[
                                                latitude,
                                                longitude,
                                            ]}
                                            zoom={16}
                                            scrollWheelZoom={true}
                                            className="w-full h-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker
                                                position={[
                                                    latitude,
                                                    longitude,
                                                ]}
                                            >
                                                <Popup>
                                                    <div className="text-sm">
                                                        <p className="font-semibold">
                                                            {
                                                                branchData.branch_name
                                                            }
                                                        </p>

                                                        <p className="text-gray-600 mt-1">
                                                            {
                                                                branchData.location
                                                            }
                                                        </p>

                                                        <p className="text-gray-500 mt-1">
                                                            {latitude.toFixed(6)},{" "}
                                                            {longitude.toFixed(
                                                                6
                                                            )}
                                                        </p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                ) : (
                                    <div className="h-[360px] rounded-lg border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center px-6">
                                        <MapPin
                                            size={36}
                                            className="text-gray-300 mb-3"
                                        />

                                        <p className="text-sm font-medium text-gray-600">
                                            Branch coordinates are not available
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Please add latitude and longitude
                                            to display the map.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-4">

                        {/* Information */}
                        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-4">

                            {/* Branch Name */}
                            <div>
                                <span className="text-sm text-gray-500 block mb-1">
                                    {t("branch_title")}:
                                </span>

                                <span className="text-base font-medium text-gray-900">
                                    {branchData.branch_name || "-"}
                                </span>
                            </div>

                            {/* Location */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin
                                        size={15}
                                        className="text-[#E52020]"
                                    />

                                    <span className="text-sm text-gray-500">
                                        {t("branch_location")}:
                                    </span>
                                </div>

                                <span className="text-base font-medium text-gray-800 leading-relaxed">
                                    {branchData.location || "-"}
                                </span>
                            </div>

                            {/* Phone */}
                            <div>
                                <span className="text-sm text-gray-500 block mb-1">
                                    {t("branch_phone")}:
                                </span>

                                <span className="text-base font-medium text-gray-800">
                                    {branchData.phone || "-"}
                                </span>
                            </div>

                            {/* Coordinates */}
                            {hasCoordinates && (
                                <div>
                                    <span className="text-sm text-gray-500 block mb-2">
                                        Coordinates:
                                    </span>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">
                                                Latitude
                                            </p>

                                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                                {latitude.toFixed(6)}
                                            </p>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">
                                                Longitude
                                            </p>

                                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                                {longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Google Maps */}
                            {hasCoordinates && (
                                <button
                                    type="button"
                                    onClick={openGoogleMaps}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E52020] hover:bg-red-700 text-white text-sm font-medium transition"
                                >
                                    <MapPin size={17} />

                                    Open Google Maps

                                    <ExternalLink size={15} />
                                </button>
                            )}
                        </div>

                        {/* Map */}
                        <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 px-1 pb-3">
                                <MapPin
                                    size={18}
                                    className="text-[#E52020]"
                                />

                                <h3 className="text-base font-semibold text-gray-800">
                                    Branch Location
                                </h3>
                            </div>

                            {hasCoordinates ? (
                                <div className="w-full h-[300px] overflow-hidden rounded-lg">
                                    <MapContainer
                                        center={[
                                            latitude,
                                            longitude,
                                        ]}
                                        zoom={16}
                                        scrollWheelZoom={true}
                                        className="w-full h-full"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <Marker
                                            position={[
                                                latitude,
                                                longitude,
                                            ]}
                                        >
                                            <Popup>
                                                <div className="text-sm">
                                                    <p className="font-semibold">
                                                        {
                                                            branchData.branch_name
                                                        }
                                                    </p>

                                                    <p className="text-gray-600 mt-1">
                                                        {
                                                            branchData.location
                                                        }
                                                    </p>

                                                    <p className="text-gray-500 mt-1">
                                                        {latitude.toFixed(6)},{" "}
                                                        {longitude.toFixed(6)}
                                                    </p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] rounded-lg border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center px-5">
                                    <MapPin
                                        size={32}
                                        className="text-gray-300 mb-3"
                                    />

                                    <p className="text-sm font-medium text-gray-600">
                                        Branch coordinates are not available
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Please add latitude and longitude
                                        to display the map.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBranch;
