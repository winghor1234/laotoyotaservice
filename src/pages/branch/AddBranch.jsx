// import { Wrench, X } from "lucide-react";
// import Spinner from "../../utils/Loading";
// import { useAddBranchForm } from "../../component/schemaValidate/branchValidate/AddBranchValidate";
// import { useTranslation } from "react-i18next";


// const AddBranch = ({ show, onClose, handleFetchBranch }) => {
//   const { t } = useTranslation("branch"); // namespace 'Branch'
//   const { register, handleSubmit, errors, loading, onSubmit, } = useAddBranchForm({ onClose, handleFetchBranch });

//   if (!show) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
//         <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
//           {t("add_branch")} 
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
//           {/* Title & Detail */}
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//             {/* ช่องที่ 1 */}
//             <div className="w-full h-20">
//               <input
//                 type="text"
//                 placeholder={t("branch_title")}
//                 {...register("branch_name")}
//                 // {/* เพิ่ม 'border' เข้าไปข้างหน้าสี */}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//               />
//               {errors.branch_name && <p className="text-red-500 text-xs mt-1">{errors.branch_name.message}</p>}
//             </div>

//             {/* ช่องที่ 2 */}
//             <div className="w-full h-20">
//               <input
//                 type="text"
//                 placeholder={t("branch_location")}
//                 {...register("location")}
//                 // {/* เพิ่ม 'border' เข้าไปข้างหน้าสี */}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//               />
//               {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
//             </div>

//             {/* ช่องที่ 3 (Phone) */}
//             <div className="w-full h-20">
//               <input
//                 type="text"
//                 placeholder={t("branch_phone")}
//                 {...register("phone")}
//                 // {/* ปรับให้เหมือนกันเพื่อความสม่ำเสมอ */}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//               />
//               {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
//             <button
//               type="button"
//               onClick={() => {
//                 onClose();
//               }}
//               className="bg-red-600 hover:bg-red-700 focus:border-1 hover:border-1 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
//               disabled={loading}
//             >
//               {t("cancel")} {/* ຍົກເລີກ / Cancel */}
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
//               disabled={loading}
//             >
//               {loading ? <Spinner size="5" color="white" /> : t("submit")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddBranch;

// import { MapPin, ExternalLink } from "lucide-react";
// import Spinner from "../../utils/Loading";
// import { useAddBranchForm } from "../../component/schemaValidate/branchValidate/AddBranchValidate";
// import { useTranslation } from "react-i18next";

// const AddBranch = ({ show, onClose, handleFetchBranch }) => {
//   const { t } = useTranslation("branch");

//   const {
//     register,
//     handleSubmit,
//     errors,
//     loading,
//     onSubmit,
//     getValues,
//   } = useAddBranchForm({
//     onClose,
//     handleFetchBranch,
//   });

//   // Open Google Maps using manually entered coordinates
//   const openGoogleMaps = () => {
//     const { latitude, longitude } = getValues();

//     const lat = String(latitude ?? "").trim();
//     const lng = String(longitude ?? "").trim();

//     // if (!lat || !lng) {
//     //   alert("Please enter latitude and longitude first.");
//     //   return;
//     // }

//     const url =
//       `https://www.google.com/maps/search/?api=1` +
//       `&query=${encodeURIComponent(`${lat},${lng}`)}`;

//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   if (!show) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
//         onClick={() => {
//           if (!loading) {
//             onClose();
//           }
//         }}
//       />

//       {/* Modal */}
//       <div
//         className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="add-branch-title"
//       >
//         {/* Header */}
//         <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
//           <h2
//             id="add-branch-title"
//             className="text-center text-lg font-bold text-gray-800 sm:text-xl"
//           >
//             {t("add_branch")}
//           </h2>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="overflow-y-auto px-5 py-5 sm:px-6"
//         >
//           <div className="space-y-5">

//             {/* Branch Name + Phone */}
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//               {/* Branch Name */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                   {t("branch_title")}
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   placeholder={t("branch_title")}
//                   autoComplete="organization"
//                   {...register("branch_name")}
//                   className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
//                     errors.branch_name
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                 />

//                 {errors.branch_name && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.branch_name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                   {t("branch_phone")}
//                 </label>

//                 <input
//                   type="tel"
//                   placeholder={t("branch_phone")}
//                   autoComplete="tel"
//                   {...register("phone")}
//                   className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
//                     errors.phone
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                 />

//                 {errors.phone && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Branch Location */}
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 {t("branch_location")}
//                 <span className="ml-1 text-red-500">*</span>
//               </label>

//               <textarea
//                 rows={3}
//                 placeholder={t("branch_location")}
//                 autoComplete="street-address"
//                 {...register("location")}
//                 className={`w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
//                   errors.location
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//               />

//               {errors.location && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.location.message}
//                 </p>
//               )}
//             </div>

//             {/* Coordinates */}
//             <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

//               {/* Title */}
//               <div className="mb-4 flex items-center gap-2">
//                 <MapPin
//                   size={19}
//                   className="text-red-600"
//                 />

//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-800">
//                     Branch Coordinates
//                   </h3>

//                   <p className="text-xs text-gray-500">
//                     Enter the latitude and longitude of this branch.
//                   </p>
//                 </div>
//               </div>

//               {/* Latitude + Longitude */}
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                 {/* Latitude */}
//                 <div>
//                   <label
//                     htmlFor="branch-latitude"
//                     className="mb-1.5 block text-sm font-medium text-gray-700"
//                   >
//                     Latitude
//                   </label>

//                   <input
//                     id="branch-latitude"
//                     type="number"
//                     step="any"
//                     placeholder="e.g. 17.9757"
//                     {...register("latitude")}
//                     className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
//                       errors.latitude
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />

//                   {errors.latitude && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {errors.latitude.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Longitude */}
//                 <div>
//                   <label
//                     htmlFor="branch-longitude"
//                     className="mb-1.5 block text-sm font-medium text-gray-700"
//                   >
//                     Longitude
//                   </label>

//                   <input
//                     id="branch-longitude"
//                     type="number"
//                     step="any"
//                     placeholder="e.g. 102.6331"
//                     {...register("longitude")}
//                     className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
//                       errors.longitude
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />

//                   {errors.longitude && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {errors.longitude.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Google Maps Button */}
//               <div className="mt-4">
//                 <button
//                   type="button"
//                   onClick={openGoogleMaps}
//                   disabled={loading}
//                   className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <ExternalLink size={16} />
//                   Open Google Maps
//                 </button>
//               </div>

//               {/* Description */}
//               <p className="mt-3 text-xs leading-5 text-gray-500">
//                 Enter the coordinates manually. You can use Google Maps
//                 to find the latitude and longitude of the branch.
//               </p>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-6 flex flex-col-reverse justify-center gap-3 border-t border-gray-100 pt-5 sm:flex-row">

//             {/* Cancel */}
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-32"
//             >
//               {t("cancel")}
//             </button>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-32"
//             >
//               {loading ? (
//                 <Spinner size="5" color="white" />
//               ) : (
//                 t("submit")
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddBranch;


import { useEffect, useState } from "react";
import { Wrench, X, MapPin, ExternalLink,} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "../../utils/Loading";
import { useAddBranchForm,} from "../../component/schemaValidate/branchValidate/AddBranchValidate";
import { useTranslation } from "react-i18next";

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
   Default Map Position
   Vientiane, Laos
========================================================= */

const DEFAULT_POSITION = [17.9757, 102.6331];

/* =========================================================
   Map Click Handler
========================================================= */

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    },
  });

  return null;
};

/* =========================================================
   Add Branch
========================================================= */

const AddBranch = ({
  show,
  onClose,
  handleFetchBranch,
}) => {
  const { t } = useTranslation("branch");

  const {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    getValues,
    setValue,
  } = useAddBranchForm({
    onClose,
    handleFetchBranch,
  });

  /* -------------------------------------------------------
     Map Position
  ------------------------------------------------------- */

  const [mapPosition, setMapPosition] = useState(
    DEFAULT_POSITION
  );

  /* =======================================================
     Load Existing Coordinates
  ======================================================= */

  useEffect(() => {
    if (!show) return;

    const values = getValues();

    const latitude = Number(values.latitude);
    const longitude = Number(values.longitude);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      setMapPosition([
        latitude,
        longitude,
      ]);
    } else {
      setMapPosition(DEFAULT_POSITION);
    }
  }, [show, getValues]);

  /* =======================================================
     Handle Map Click
  ======================================================= */

  const handleMapLocationSelect = ({
    latitude,
    longitude,
  }) => {
    const formattedLatitude =
      latitude.toFixed(6);

    const formattedLongitude =
      longitude.toFixed(6);

    setValue(
      "latitude",
      formattedLatitude,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    setValue(
      "longitude",
      formattedLongitude,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    setMapPosition([
      latitude,
      longitude,
    ]);
  };

  /* =======================================================
     Open Google Maps
  ======================================================= */

  const openGoogleMaps = () => {
    const values = getValues();

    const latitude = String(
      values.latitude ?? ""
    ).trim();

    const longitude = String(
      values.longitude ?? ""
    ).trim();

    if (!latitude || !longitude) {
      alert(
        "Please select a location on the map first."
      );
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      alert(
        "Please enter valid latitude and longitude."
      );
      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1` +
      `&query=${encodeURIComponent(
        `${lat},${lng}`
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     Close
  ======================================================= */

  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  /* =======================================================
     Hide Modal
  ======================================================= */

  if (!show) return null;

  /* =======================================================
     Render
  ======================================================= */

  return (
    <>
      {/* ===================================================
          Overlay
      =================================================== */}

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* ===================================================
          Modal
      =================================================== */}

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-sm">
        {/* =================================================
            Header
        ================================================= */}

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-[#E52020]">
              <Wrench size={20} />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {t("add_branch")}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            Form
        ================================================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* =================================================
              Branch Information
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* ------------------------------------------------
                Branch Name
            ------------------------------------------------ */}

            <div className="w-full min-h-[82px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("branch_title")}
              </label>

              <input
                type="text"
                placeholder={t("branch_title")}
                {...register("branch_name")}
                disabled={loading}
                className={`w-full h-11 px-3 rounded-lg border ${errors.branch_name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#E52020] focus:ring-[#E52020]"
                  } outline-none focus:ring-1 transition disabled:bg-gray-100`}
              />

              {errors.branch_name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.branch_name.message}
                </p>
              )}
            </div>

            {/* ------------------------------------------------
                Location
            ------------------------------------------------ */}

            <div className="w-full min-h-[82px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("branch_location")}
              </label>

              <input
                type="text"
                placeholder={t("branch_location")}
                {...register("location")}
                disabled={loading}
                className={`w-full h-11 px-3 rounded-lg border ${errors.location
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#E52020] focus:ring-[#E52020]"
                  } outline-none focus:ring-1 transition disabled:bg-gray-100`}
              />

              {errors.location && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* ------------------------------------------------
                Phone
            ------------------------------------------------ */}

            <div className="w-full min-h-[82px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("branch_phone")}
              </label>

              <input
                type="text"
                placeholder={t("branch_phone")}
                {...register("phone")}
                disabled={loading}
                className={`w-full h-11 px-3 rounded-lg border ${errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#E52020] focus:ring-[#E52020]"
                  } outline-none focus:ring-1 transition disabled:bg-gray-100`}
              />

              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              Map Picker
          ================================================= */}

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* ------------------------------------------------
                Map Header
            ------------------------------------------------ */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin
                  size={19}
                  className="text-[#E52020] mt-0.5 shrink-0"
                />

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t("select_branch")}
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("map_hint")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openGoogleMaps}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition text-xs sm:text-sm"
                >
                <ExternalLink size={15} />
                {t("open_google_maps")}
              </button>
            </div>

            {/* ------------------------------------------------
                Leaflet Map
            ------------------------------------------------ */}

            <div className="w-full h-[280px] sm:h-[350px]">
              <MapContainer
                center={mapPosition}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Map Click */}

                <MapClickHandler
                  onLocationSelect={
                    handleMapLocationSelect
                  }
                />

                {/* Marker */}

                <Marker position={mapPosition}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">
                        {t("select_branch")}
                      </p>

                      <p>
                        {t("Latitude")}:{" "}
                        {mapPosition[0].toFixed(6)}
                      </p>

                      <p>
                        {t("Longitude")}:{" "}
                        {mapPosition[1].toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* =================================================
                Coordinates
            ================================================= */}

            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ------------------------------------------------
                    Latitude
                ------------------------------------------------ */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("Latitude")}
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="17.975700"
                    {...register("latitude")}
                    disabled={loading}
                    className={`w-full h-11 px-3 rounded-lg border ${errors.latitude
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#E52020] focus:ring-[#E52020]"
                      } outline-none focus:ring-1 transition disabled:bg-gray-100`}
                  />

                  {errors.latitude && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------
                    Longitude
                ------------------------------------------------ */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("Longitude")}
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="102.633100"
                    {...register("longitude")}
                    disabled={loading}
                    className={`w-full h-11 px-3 rounded-lg border ${errors.longitude
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#E52020] focus:ring-[#E52020]"
                      } outline-none focus:ring-1 transition disabled:bg-gray-100`}
                      />

                  {errors.longitude && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------
                  Helper Text
              ------------------------------------------------ */}

              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0"
                  />

                <p>
                  {t("map_click_hint")}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              Buttons
          ================================================= */}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            {/* Cancel */}

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {t("cancel")}
            </button>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[120px] px-5 py-2.5 rounded-lg bg-[#E52020] text-white font-medium hover:bg-[#c91b1b] disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              {loading ? (
                <Spinner
                  size="5"
                  color="white"
                />
              ) : (
                t("submit")
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBranch;