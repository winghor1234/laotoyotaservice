// import Spinner from "../../utils/Loading";
// import { useEditBranchForm } from "../../component/schemaValidate/branchValidate/EditBranchValidate";
// import { useTranslation } from "react-i18next";

// const EditBranch = ({ show, onClose, branch_id, handleFetchBranch }) => {
//   const { t } = useTranslation("branch");
//   const { register, handleSubmit, submitForm, loading, formState: { errors } } = useEditBranchForm({ onClose, handleFetchBranch, branch_id });

//   if (!show) return null;

//   return (
//     <>
//       <div
//         className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
//         onClick={onClose}
//       />
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
//         <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
//           {t("edit_Branch")}
//         </h2>
//         <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//             <div className="flex flex-col">
//               <input
//                 type="text"
//                 placeholder={t("branch_title")}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//                 {...register("branch_name")}
//               />
//               <div className="h-6">
//                 {errors.branch_name && <p className="text-red-500">{errors.branch_name.message}</p>}
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <input
//                 type="text"
//                 placeholder={t("branch_detail")}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//                 {...register("location")}
//               />
//               <div className="h-6">
//                 {errors.location && <p className="text-red-500">{errors.location.message}</p>}
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <input
//                 type="number"
//                 placeholder={t("branch_phone")}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//                 {...register("phone")}
//               />
//               <div className="h-6">
//                 {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
//             <button
//               type="button"
//               onClick={() => {
//                 onClose();
//               }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
//               disabled={loading}
//             >
//               {t("cancel")}
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

// export default EditBranch;


import { useEffect, useMemo } from "react";
import { Wrench, X, MapPin, ExternalLink } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useEditBranchForm } from "../../component/schemaValidate/branchValidate/EditBranchValidate";

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
   Default Map Position — Vientiane, Laos
========================================================= */

const DEFAULT_POSITION = [17.9757, 102.6331];

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

/* =========================================================
   Map Click Handler
========================================================= */

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  return null;
};

/* =========================================================
   Map Recenter
   MapContainer's `center` only applies on first render, so
   when the branch data loads (or the inputs change) we move
   the map ourselves.
========================================================= */

const MapRecenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
};

/* =========================================================
   Edit Branch
========================================================= */

const EditBranch = ({ show, onClose, branch_id, handleFetchBranch }) => {
  const { t } = useTranslation("branch");

  const {
    register,
    handleSubmit,
    submitForm,
    loading,
    errors,
    getValues,
    setValue,
    watch,
  } = useEditBranchForm({ onClose, handleFetchBranch, branch_id });

  /* -------------------------------------------------------
     Map Position (derived from the form values)
  ------------------------------------------------------- */

  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");

  const mapPosition = useMemo(() => {
    const latitude = Number(watchedLatitude);
    const longitude = Number(watchedLongitude);

    if (
      watchedLatitude !== "" &&
      watchedLongitude !== "" &&
      isValidCoordinate(latitude, longitude)
    ) {
      return [latitude, longitude];
    }

    return DEFAULT_POSITION;
  }, [watchedLatitude, watchedLongitude]);

  /* =======================================================
     Handle Map Click
  ======================================================= */

  const handleMapLocationSelect = ({ latitude, longitude }) => {
    setValue("latitude", latitude.toFixed(6), {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("longitude", longitude.toFixed(6), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* =======================================================
     Open Google Maps
  ======================================================= */

  const openGoogleMaps = () => {
    const values = getValues();

    const latitude = String(values.latitude ?? "").trim();
    const longitude = String(values.longitude ?? "").trim();

    if (!latitude || !longitude) {
      alert("Please select a location on the map first.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!isValidCoordinate(lat, lng)) {
      alert("Please enter valid latitude and longitude.");
      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1` +
      `&query=${encodeURIComponent(`${lat},${lng}`)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* =======================================================
     Close
  ======================================================= */

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!show) return null;

  /* =======================================================
     Render
  ======================================================= */

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-[#E52020]">
              <Wrench size={20} />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {t("edit_Branch")}
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

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* Branch Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Branch Name */}
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

            {/* Location */}
            <div className="w-full min-h-[82px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("branch_detail")}
              </label>

              <input
                type="text"
                placeholder={t("branch_detail")}
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

            {/* Phone */}
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

          {/* Map Picker */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Map Header */}
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

            {/* Leaflet Map */}
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

                <MapRecenter position={mapPosition} />

                <MapClickHandler onLocationSelect={handleMapLocationSelect} />

                <Marker position={mapPosition}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">{t("select_branch")}</p>
                      <p>{t("Latitude")}: {mapPosition[0].toFixed(6)}</p>
                      <p>{t("Longitude")}: {mapPosition[1].toFixed(6)}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Coordinates */}
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Latitude */}
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

                {/* Longitude */}
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

              {/* Helper Text */}
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0" />

                <p>
                  {t("map_click_hint")}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[120px] px-5 py-2.5 rounded-lg bg-[#E52020] text-white font-medium hover:bg-[#c91b1b] disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              {loading ? <Spinner size="5" color="white" /> : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBranch;