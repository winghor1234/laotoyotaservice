import { Wrench, X } from "lucide-react";
import Spinner from "../../utils/Loading";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import { useAddPromotionForm } from "../../component/schemaValidate/promotionValidate/AddPromotionValidate";
import { useTranslation } from "react-i18next";

const AddPromotion = ({ show, onClose, handleFetchPromotion }) => {
  const { t } = useTranslation("promotion"); // namespace 'promotion'
  const { register, handleSubmit, setValue, errors, imageFile, loading, onSubmit } =
    useAddPromotionForm({ onClose, handleFetchPromotion });

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
          {t("add_promotion")} {/* เพิ่ม promotion */}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          {/* Title & Detail */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("promotion_title")} // ຊື່ໂປຣໂມຊັ່ນ / Promotion Title
                {...register("title")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("promotion_detail")} // ລາຍລະອຽດ / Detail
                {...register("detail")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.detail && <p className="text-red-500">{errors.detail.message}</p>}
            </div>
          </div>

          {/* Image Preview */}
          <div className="mb-2">
            {imageFile && imageFile[0] instanceof File ? (
              <div className="relative shadow-2xl h-56 w-72 mb-2 flex items-center justify-center gap-2">
                <img
                  src={URL.createObjectURL(imageFile[0])}
                  alt="promotion"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setValue("image", null)}
                  className="bg-red-500 text-white cursor-pointer absolute top-1 right-1 px-2 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  <X />
                </button>
              </div>
            ) : (
              <div className="h-56 w-72 mb-2 flex items-center justify-center shadow-2xl">
                <h1 className="text-gray-500 font-extrabold text-2xl">
                  {t("no_image")} {/* ບໍ່ມີຮູບພາບ / No Image */}
                </h1>
              </div>
            )}
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>

          {/* File Upload */}
          <div className="border border-gray-300 rounded-lg flex items-center gap-2 px-2 py-1">
            <Wrench className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setValue("image", e.target.files)}
              className="w-full py-1 sm:py-2 px-2 sm:px-3 text-sm sm:text-base outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
            <button
              type="button"
              onClick={() => {
                SuccessAlert(t("cancel_add")); // ຍົກເລີກການເພີ່ມ / Cancel Add
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
              disabled={loading}
            >
              {t("cancel")} {/* ຍົກເລີກ / Cancel */}
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="5" color="white" /> : t("submit")} {/* ຕົກລົງ / Submit */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPromotion;
