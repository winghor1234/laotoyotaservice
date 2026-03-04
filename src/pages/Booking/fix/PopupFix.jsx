
// PopupFix.jsx
import { useFixForm } from "../../../component/schemaValidate/fixValidate/PopupFixValidate";
import { useTranslation } from "react-i18next";
import CurrencyInput from "react-currency-input-field";

const PopupFix = ({ setShowPopup, bookingId, timeId }) => {
  const { t } = useTranslation("booking");
  const { register, handleSubmit, errors, submitForm, setValue, watch } = useFixForm({ bookingId, timeId });

  const fixCarPrice = watch("fixCarPrice") || 0;
  const carPartPrice = watch("carPartPrice") || 0;
  const totalPrice = Number(fixCarPrice) + Number(carPartPrice);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="bg-white flex flex-col gap-6 p-4 sm:p-6 rounded-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
          {t("fix_title")}
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* KM Last & KM Next */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* KM Last */}
            <div className="flex flex-col relative">
              <input
                {...register("kmLast")}
                placeholder={t("kmLast")}
                className="w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
              />
              <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg pointer-events-none">
                {t("km_text")}
              </span>
              <div className="h-6">{errors.kmLast && <p className="text-red-500 text-sm">{errors.kmLast.message}</p>}</div>
            </div>

            {/* KM Next */}
            <div className="flex flex-col relative">
              <input
                {...register("kmNext")}
                placeholder={t("kmNext")}
                className="w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
              />
              <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg">
                {t("km_text")}
              </span>
              <div className="h-6">{errors.kmNext && <p className="text-red-500 text-sm">{errors.kmNext.message}</p>}</div>
            </div>
          </div>

          {/* Detail Fix */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("Optional_text")}</label>
            <textarea
              {...register("detailFix")}
              placeholder={t("detailFix")}
              rows={3}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors resize-none"
            />
            {/* <div className="h-6">{errors.detailFix && <p className="text-red-500 text-sm">{errors.detailFix.message}</p>}</div> */}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* fixCarPrice */}
            <div className="flex flex-col relative">
              <CurrencyInput
                {...register("fixCarPrice")}
                placeholder={t("fixCarPrice")}
                groupSeparator=","
                decimalsLimit={0}
                min={0}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                onValueChange={(value) => setValue("fixCarPrice", Number(value) || 0)}
              />
              <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg">
                {t("kip_text")}
              </span>
              <div className="h-6">{errors.fixCarPrice && <p className="text-red-500 text-sm">{errors.fixCarPrice.message}</p>}</div>
            </div>

            {/* carPartPrice */}
            <div className="flex flex-col relative">
              <CurrencyInput
                {...register("carPartPrice")}
                placeholder={t("carPartPrice")}
                groupSeparator=","
                decimalsLimit={0}
                min={0}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                onValueChange={(value) => setValue("carPartPrice", Number(value) || 0)}
              />
              <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg">
                {t("kip_text")}
              </span>
              <div className="h-6">{errors.carPartPrice && <p className="text-red-500 text-sm">{errors.carPartPrice.message}</p>}</div>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex flex-col relative">
            <CurrencyInput
              value={totalPrice}
              readOnly
              placeholder={t("totalPrice")}
              groupSeparator=","
              decimalsLimit={0}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors bg-gray-100 pr-12"
            />
            <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg">
              {t("kip_text")}
            </span>
            <div className="h-6">{errors.totalPrice && <p className="text-red-500 text-sm">{errors.totalPrice.message}</p>}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4">
          <button
            type="button"
            onClick={() => setShowPopup(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
          >
            {t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupFix;