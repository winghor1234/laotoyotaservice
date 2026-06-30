import { X, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import Spinner from "../../utils/Loading";
import { useEditStoreForm } from "../../component/schemaValidate/storeValidate/EditStoreValidate";

const EditStore = ({ show, onClose, store_id, handleFetchStore }) => {
  const { t } = useTranslation("store");
  const { register, handleSubmit, submitForm, errors, loading, imageFile, setImageFile, existingImage } =
    useEditStoreForm({ onClose, store_id, handleFetchStore });

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">{t("edit_store")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("store_name")}
              {...register("name")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder={t("address")}
              {...register("address")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder={t("phone")}
              {...register("phone")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <input
              type="number"
              min={0}
              placeholder={t("discount")}
              {...register("discount")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm outline-none hover:border-red-500 focus:border-red-600 shadow-sm transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">{t("qr_regenerate")}</p>
            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">{t("image")}</label>
            {existingImage && !imageFile && (
              <img src={existingImage} alt="existing" className="w-32 h-32 object-cover rounded-lg border mb-2" />
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
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </label>
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">{t("status")}:</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("status")} className="w-4 h-4" />
              <span className="text-sm">{t("active")}</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-2">
            <button
              type="button"
              onClick={onClose}
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
