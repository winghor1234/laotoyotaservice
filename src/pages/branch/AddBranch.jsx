import { Wrench, X } from "lucide-react";
import Spinner from "../../utils/Loading";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import { useAddBranchForm } from "../../component/schemaValidate/BranchValidate/AddBranchValidate";
import { useTranslation } from "react-i18next";


const AddBranch = ({ show, onClose, handleFetchBranch }) => {
  const { t } = useTranslation("branch"); // namespace 'Branch'
  const { register, handleSubmit, errors, loading, onSubmit,  } = useAddBranchForm({ onClose, handleFetchBranch });

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
          {t("add_branch")} {/* เพิ่ม Branch */}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          {/* Title & Detail */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("branch_title")} // ຊື່ / Branch Title
                {...register("branch_name")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.branch_name && <p className="text-red-500">{errors.branch_name.message}</p>}
            </div>

            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("branch_location")} // ສະຖານທີ່ / Branch Location
                {...register("location")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </div>
            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("branch_phone")}  // ເບີໂທສາຂາ / Branch Phone Number
                {...register("phone")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>
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
              {loading ? <Spinner size="5" color="white" /> : t("submit")} 
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBranch;
