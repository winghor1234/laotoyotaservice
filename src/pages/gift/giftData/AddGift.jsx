import { useTranslation } from "react-i18next";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import Spinner from "../../../utils/Loading";
import { useAddGiftForm } from "../../../component/schemaValidate/giftValidate.js/AddGiftValidate";
import { Controller } from "react-hook-form";
import ImageUpload from "../../../utils/imageUpload";

const AddGift = ({ show, onClose, handleFetch }) => {
  const { t } = useTranslation("gift");
  const { register, handleSubmit, formState: { errors }, submitForm, loading, control } = useAddGiftForm({ onClose, handleFetch });

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{t("add_gift")}</h2>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
          {/* Inputs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex flex-col">
              <input
                {...register("name")}
                placeholder={t("gift_name")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              <div className="h-6">{errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}</div>
            </div>
            <div className="flex flex-col">
              <input
                {...register("amount")}
                placeholder={t("amount")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              <div className="h-6">{errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}</div>
            </div>
            <div className="flex flex-col">
              <input
                {...register("point")}
                placeholder={t("point")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              <div className="h-6">{errors.point && <p className="text-red-500 text-sm">{errors.point.message}</p>}</div>
            </div>
          </div>

          {/* Image preview */}
          {/* <div className="mb-2">
            {imageFile && imageFile[0] instanceof File ? (
              <div className="relative shadow-2xl h-56 w-72 mb-2 flex items-center justify-center gap-2">
                <img
                  src={URL.createObjectURL(imageFile[0])}
                  alt="service"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  // onClick={() => setValue({ image: null })}
                  onClick={() => setValue("image", null)}
                  className="bg-red-500 text-white cursor-pointer absolute top-1 right-1 px-2 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  <X />
                </button>
              </div>
            ) : (
              <div className="h-56 w-72 mb-2 flex items-center justify-center shadow-2xl">
                <h1 className="text-gray-500 font-extrabold text-2xl">{t("no_image")}</h1>
              </div>
            )}
            <div className="h-8 flex items-center">{errors.image && <p className="text-red-500">{errors.image.message}</p>}</div>
          </div> */}

          {/* File upload */}
          {/* <div className="border border-gray-300 rounded-lg flex items-center gap-2 px-2 py-1">
            <Wrench className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setValue("image", e.target.files)}
              className="w-full py-1 sm:py-2 px-2 sm:px-3 text-sm sm:text-base outline-none"
            />
          </div> */}
          {/* <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 px-4 py-6 cursor-pointer transition ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          >
            <Wrench className="text-gray-400 w-6 h-6" />
            <p className="text-sm text-gray-500">
              ลากรูปมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setValue("image", e.target.files)}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="text-blue-600 text-sm underline cursor-pointer"
            >
              เลือกรูปภาพ
            </label>
          </div> */}

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
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
            <button
              type="button"
              onClick={() => {
                SuccessAlert(t("cancel_add_alert"));
                onClose();
              }}
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

export default AddGift;
