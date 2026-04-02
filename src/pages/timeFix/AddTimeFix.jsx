import { useAddTimeFixForm } from "../../component/schemaValidate/timeFixValidate/AddTimeFixValidate";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";

const AddTimeFix = ({ show, onClose, fetchTimeFix }) => {
  const { t } = useTranslation("timeZone");
  const { register, handleSubmit, formState: { errors }, loading, submitForm, time, zone, branch } = useAddTimeFixForm({ onClose, fetchTimeFix });

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
          {t("add_time_fix_title")}
        </h2>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <select
              {...register("timeId")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
            >
              <option value="" disabled>{t("selectTime")}</option>
              {time.length > 0 ? time.map(time => (
                <option key={time.time_id} value={time.time_id}>{time.time}</option>
              )) : <option value="">{t("noTime")}</option>}
            </select>
            <div className="h-6">
              {errors.timeId && <p className="text-red-500 text-sm">{errors.timeId.message}</p>}
            </div>


            <select
              {...register("zoneId")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
            >
              <option value="" disabled>{t("selectZone")}</option>
              {zone.length > 0 ? zone.map(zone => (
                <option key={zone.zone_id} value={zone.zone_id}>{zone.zoneName}</option>
              )) : <option value="">{t("noZone")}</option>}
            </select>
            <div className="h-6">
              {errors.zoneId && <p className="text-red-500 text-sm">{errors.zoneId.message}</p>}
            </div>

            <select
              {...register("branchId")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
            >
              <option value="" disabled>{t("selectBranch")}</option>
              {branch.length > 0 ? branch.map(branch => (
                <option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>
              )) : <option value="">{t("noBranch")}</option>}
            </select>
            <div className="h-6">
              {errors.branchId && <p className="text-red-500 text-sm">{errors.branchId.message}</p>}
            </div>
          </div>


          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
            <button
              type="button"
              onClick={() => { SuccessAlert(t("editTimeCancelMessage")); onClose(); }}
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

export default AddTimeFix;
