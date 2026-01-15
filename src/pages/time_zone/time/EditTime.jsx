import { useEditTimeForm } from "../../../component/schemaValidate/time-zone/EdittTimeValidate";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import Spinner from "../../../utils/Loading";
import { useTranslation } from "react-i18next";

const EditTime = ({ show, onClose, timeId, fetchTime }) => {
    const { t } = useTranslation("timeZone");
    const { register, handleSubmit, formState: { errors }, loading, submitForm, zones } = useEditTimeForm({ onClose, timeId, fetchTime });

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
                    {t("edit_time_title")}
                </h2>
                <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder={t("timeLabel")}
                                {...register("time")}
                                className="w-full py-2 sm:py-3.5 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                            />
                            <div className="h-6">
                                {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
                            </div>

                        </div>
                        <div className="w-full ">
                            <input
                                type="date"
                                placeholder={t("dateLabel")}
                                {...register("date")}
                                className=" w-full py-2 sm:py-3.5 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                            />
                            <div className="h-6">
                                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                            </div>
                        </div>


                        <div className="w-full">
                            <select
                                {...register("zoneId")}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                            >
                                <option value="" disabled>{t("selectZone")}</option>
                                {zones.length > 0 ? zones.map(zone => (
                                    <option key={zone.zone_id} value={zone.zone_id}>{zone.zoneName}</option>
                                )) : <option value="">{t("noZone")}</option>}
                            </select>
                            <div className="h-6">
                                {errors.zoneId && <p className="text-red-500 text-sm">{errors.zoneId.message}</p>}
                            </div>
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

export default EditTime;
