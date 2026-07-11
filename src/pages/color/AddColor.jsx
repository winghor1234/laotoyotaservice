import { useAddColorForm } from "../../component/schemaValidate/colorValidate/AddColorValidate";
import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";

const AddColor = ({ show, onClose, fetchColor }) => {
  const { t } = useTranslation("color");
  const { register, handleSubmit, formState: { errors }, submitForm, loading } = useAddColorForm({ onClose, fetchColor });

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
          {t("add_color_title")}
        </h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col ">
            <div className="w-full flex flex-col">
              <input
                type="text"
                {...register("colorName")}
                placeholder={t("color_name")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-red-500 focus:border-red-600 shadow-sm"
              />
              <div className="h-6">
                {errors.colorName && (
                  <span className="text-red-500 text-sm">{errors.colorName.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
            <button
              type="button"
              onClick={() => {
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

export default AddColor;
