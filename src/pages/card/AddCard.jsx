import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useAddCardForm } from "../../component/schemaValidate/cardValidate/AddCardValidate";

const AddCard = ({ show, onClose, handleFetchCard }) => {
    const { t } = useTranslation("card");

    const {
        register,
        handleSubmit,
        loading,
        onSubmit,
        formState: { errors },
        users,
    } = useAddCardForm({ onClose, handleFetchCard });

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-5xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm overflow-y-auto max-h-[95vh]">

                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
                    {t("add_card")}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* ================= ROW 1 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* User */}
                        <div>
                            <label>{t("select_user")}</label>
                            <select
                                {...register("userId")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            >
                                <option value="">{t("select_user")}</option>

                                {users?.filter((item) => item.role === "general").map((item) => (
                                    <option key={item.user_id} value={item.user_id}>
                                        {item.customer_number} : {item.username}
                                    </option>
                                ))}
                            </select>

                            <div className="h-5 mt-1">
                                {errors.userId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.userId.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Discount */}
                        <div>
                            <label>{t("discount")}</label>
                            <input
                                type="number"
                                placeholder={t("discount")}
                                {...register("discount")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />

                            <div className="h-5 mt-1">
                                {errors.discount && (
                                    <p className="text-red-500 text-sm">
                                        {errors.discount.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= ROW 2 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label>{t("card_number")}</label>
                            <input
                                type="text"
                                placeholder={t("card_number")}
                                {...register("card_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                            <div className="h-5 mt-1">
                                {errors.card_number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.card_number.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label>{t("vip_number")}</label>
                            <input
                                type="text"
                                placeholder={t("vip_number")}
                                {...register("vip_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                            <div className="h-5 mt-1">
                                {errors.vip_number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.vip_number.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= ROW 3 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label>{t("card_type")}</label>
                            <input
                                type="text"
                                placeholder={t("card_type")}
                                {...register("card_type")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label>{t("received")}</label>
                            <input
                                type="text"
                                placeholder={t("received")}
                                {...register("received")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("plate_number")}</label>
                            <input
                                type="text"
                                placeholder={t("plate_number")}
                                {...register("plate_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 4 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div>
                            <label>{t("vehicle_model")}</label>
                            <input
                                type="text"
                                placeholder={t("vehicle_model")}
                                {...register("vehicle_model")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("color")}</label>
                            <input
                                type="text"
                                placeholder={t("color")}
                                {...register("color")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("frame_number")}</label>
                            <input
                                type="text"
                                placeholder={t("frame_number")}
                                {...register("frame_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 5 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label>{t("engine_number")}</label>
                            <input
                                type="text"
                                placeholder={t("engine_number")}
                                {...register("engine_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("count_card")}</label>
                            <input
                                type="number"
                                placeholder={t("count_card")}
                                {...register("countCard")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 6 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div>
                            <label>{t("active_point")}</label>
                            <input
                                type="number"
                                placeholder={t("active_point")}
                                {...register("active_point")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label>{t("total_point")}</label>
                            <input
                                type="number"
                                placeholder={t("total_point")}
                                {...register("total_point")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("running_part")}</label>
                            <input
                                type="number"
                                placeholder={t("running_part")}
                                {...register("running_part")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 7 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label>{t("running_labour")}</label>
                            <input
                                type="number"
                                placeholder={t("running_labour")}
                                {...register("running_labour")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                        

                        <div>
                            <label>{t("gold_issued")}</label>
                            <input
                                type="date"
                                placeholder={t("gold_issued")}
                                {...register("goldIssued")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 8 ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label>{t("issued_date")}</label>
                            <input
                                type="date"
                                placeholder={t("issued_date")}
                                {...register("issued_date")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label>{t("expiration_date")}</label>
                            <input
                                type="date"
                                placeholder={t("expiration_date")}
                                {...register("expiration_date")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ================= BUTTONS ================= */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 flex items-center justify-center gap-2"
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

export default AddCard;