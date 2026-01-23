import { useTranslation } from "react-i18next";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import Spinner from "../../../utils/Loading";
import { useEditForm } from "../../../component/schemaValidate/giftValidate.js/EditGiftValidate";
import { Controller } from "react-hook-form";
import ImageUpload from "../../../utils/imageUpload";

const EditGift = ({ show, onClose, giftId, handleFetch }) => {
  const { t } = useTranslation('gift');
  const { register, handleSubmit, errors, submitForm, loading,  control } = useEditForm({ onClose, handleFetch, giftId });

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
          {t("edit_gift")}
        </h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
          {/* Inputs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex flex-col">
              <input
                {...register("name")}
                placeholder={t("gift_name")}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg outline-none"
              />
              <div className="h-6">{errors.name && <p className="text-red-500">{errors.name.message}</p>}</div>
            </div>
            <div className="flex flex-col">
              <input
                {...register("point")}
                placeholder={t("point")}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg outline-none"
              />
              <div className="h-6">{errors.point && <p className="text-red-500">{errors.point.message}</p>}</div>
            </div>
          </div>

          {/* Image preview */}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                error={errors.image?.message}
              />
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                SuccessAlert(t("cancel_edit_alert"));
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28"
              disabled={loading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 flex items-center justify-center gap-2"
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

export default EditGift;
