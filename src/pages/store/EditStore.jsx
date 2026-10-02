// import { X, Upload } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import Spinner from "../../utils/Loading";
// import { useEditStoreForm } from "../../component/schemaValidate/storeValidate/EditStoreValidate";

// const EditStore = ({ show, onClose, store_id, handleFetchStore }) => {
//   const { t } = useTranslation("store");
//   const { register, handleSubmit, submitForm, errors, loading, imageFile, setImageFile, existingImage } =
//     useEditStoreForm({ onClose, store_id, handleFetchStore });

//   if (!show) return null;

//   return (
//     <>
//       <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg sm:text-xl font-bold">{t("edit_store")}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder={t("store_name")}
//               {...register("name")}
//               className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//             />
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//           </div>

//           <div>
//             <input
//               type="text"
//               placeholder={t("address")}
//               {...register("address")}
//               className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//             />
//             {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
//           </div>

//           <div>
//             <input
//               type="text"
//               placeholder={t("phone")}
//               {...register("phone")}
//               className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//             />
//             {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//           </div>

//           {/* <div>
//             <input
//               type="number"
//               min={0}
//               placeholder={t("discount")}
//               {...register("discount")}
//               className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
//             />
//             <p className="text-xs text-gray-400 mt-1">{t("qr_regenerate")}</p>
//             {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
//           </div> */}

//           <div>
//             <label className="block text-sm text-gray-600 mb-1">{t("image")}</label>
//             {existingImage && !imageFile && (
//               <img src={existingImage} alt="existing" className="w-32 h-32 object-cover rounded-lg border mb-2" />
//             )}
//             <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-red-500 transition-colors">
//               <Upload size={16} className="text-gray-400" />
//               <span className="text-sm text-gray-500">
//                 {imageFile ? imageFile.name : t("image")}
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => setImageFile(e.target.files[0])}
//               />
//             </label>
//             {imageFile && (
//               <img
//                 src={URL.createObjectURL(imageFile)}
//                 alt="preview"
//                 className="mt-2 w-32 h-32 object-cover rounded-lg border"
//               />
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             <label className="text-sm text-gray-600">{t("status")}:</label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" {...register("status")} className="w-4 h-4" />
//               <span className="text-sm">{t("active")}</span>
//             </label>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
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

// export default EditStore;

import { useEffect, useMemo } from "react";
import { X, Upload, MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { useEditStoreForm } from "../../component/schemaValidate/storeValidate/EditStoreValidate";

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
   (MapContainer's `center` only applies on first render, so
   when the store data loads we move the map ourselves)
========================================================= */

const MapRecenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
};

/* =========================================================
   Edit Store
========================================================= */

const EditStore = ({ show, onClose, store_id, handleFetchStore }) => {
  const { t } = useTranslation("store");

  const {
    register,
    handleSubmit,
    submitForm,
    errors,
    loading,
    imageFile,
    setImageFile,
    existingImage,
    setValue,
    getValues,
    watch,
  } = useEditStoreForm({ onClose, store_id, handleFetchStore });

  /* -------------------------------------------------------
     Map Position (derived from the form values)
     The marker is shown only when coordinates are set,
     because latitude/longitude are optional for a store.
  ------------------------------------------------------- */

  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");

  const markerPosition = useMemo(() => {
    if (
      watchedLatitude === undefined ||
      watchedLongitude === undefined ||
      String(watchedLatitude).trim() === "" ||
      String(watchedLongitude).trim() === ""
    ) {
      return null;
    }

    const latitude = Number(watchedLatitude);
    const longitude = Number(watchedLongitude);

    return isValidCoordinate(latitude, longitude)
      ? [latitude, longitude]
      : null;
  }, [watchedLatitude, watchedLongitude]);

  const mapCenter = markerPosition || DEFAULT_POSITION;

  /* -------------------------------------------------------
     Image Preview (revoke the object URL to avoid leaks)
  ------------------------------------------------------- */

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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

  if (!show) return null;

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  /* =======================================================
     Render
  ======================================================= */

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">{t("edit_store")}</h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* Store Name */}
          <div>
            <input
              type="text"
              placeholder={t("store_name")}
              {...register("name")}
              disabled={loading}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors disabled:bg-gray-100"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder={t("address")}
              {...register("address")}
              disabled={loading}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors disabled:bg-gray-100"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder={t("phone")}
              {...register("phone")}
              disabled={loading}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors disabled:bg-gray-100"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* <div>
            <input
              type="number"
              min={0}
              placeholder={t("discount")}
              {...register("discount")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">{t("qr_regenerate")}</p>
            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
          </div> */}

          {/* Location / Map Picker */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin
                  size={19}
                  className="text-red-600 mt-0.5 shrink-0"
                />

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t("location") || "Location"}
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
                {t("open_google_maps") || "Open Google Maps"}
              </button>
            </div>

            {/* Leaflet Map */}
            <div className="w-full h-[260px] sm:h-[320px]">
              <MapContainer
                center={mapCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapRecenter position={mapCenter} />

                <MapClickHandler onLocationSelect={handleMapLocationSelect} />

                {markerPosition && (
                  <Marker position={markerPosition}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Store Location</p>
                        <p>{t("Latitude")}: {markerPosition[0].toFixed(6)}</p>
                        <p>{t("Longitude")}: {markerPosition[1].toFixed(6)}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
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
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors bg-white disabled:bg-gray-100"
                  />

                  {errors.latitude && (
                    <p className="text-red-500 text-xs mt-1">
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
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors bg-white disabled:bg-gray-100"
                  />

                  {errors.longitude && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0" />

                <p>
                  {t("map_click_hint")}
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("image")}
            </label>

            {existingImage && !imageFile && (
              <img
                src={existingImage}
                alt="existing"
                className="w-32 h-32 object-cover rounded-lg border mb-2"
              />
            )}

            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-red-500 transition-colors">
              <Upload size={16} className="text-gray-400" />

              <span className="text-sm text-gray-500">
                {imageFile ? imageFile.name : t("image")}
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">{t("status")}:</label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("status")}
                disabled={loading}
                className="w-4 h-4"
              />
              <span className="text-sm">{t("active")}</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
              disabled={loading}
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="5" color="white" /> : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditStore;