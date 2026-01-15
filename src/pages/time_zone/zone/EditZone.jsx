import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import Spinner from "../../../utils/Loading";
import { useEditZoneForm } from "../../../component/schemaValidate/time-zone/EditZoneValidate";
import { useTranslation } from "react-i18next";

const EditZone = ({ show, onClose, zoneId, fetchZone }) => {
    const { t } = useTranslation("timeZone"); // ใช้ namespace "zone"
    const { register, handleSubmit, formState: { errors }, submitForm, loading } = useEditZoneForm({ onClose, fetchZone, zoneId });

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{t("editZoneTitle")}</h2>
                <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
                    {/* Inputs */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex flex-col">
                            <input
                                type="text"
                                {...register("zoneName")}
                                placeholder={t("zoneName")}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                            />
                            <div className="h-6">
                                {errors.zoneName && <span className="text-red-500 text-xs">{errors.zoneName.message}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                {...register("timeFix")}
                                placeholder={t("timeFix")}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                            />
                            <div className="h-6">
                                {errors.timeFix && <span className="text-red-500 text-xs">{errors.timeFix.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                SuccessAlert(t("addZoneCancelMessage"));
                                onClose();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
                            disabled={loading}
                        >
                            {t("cancelButton")}
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="5" color="white" /> : t("submitButton")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditZone;
