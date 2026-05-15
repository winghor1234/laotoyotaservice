import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { useEditCardForm } from "../../component/schemaValidate/cardValidate/EditCardValidate";
import Select from "react-select";


const EditCard = ({ show, onClose, cardId, handleFetchCard }) => {
    const { t } = useTranslation("card");
    const { register, handleSubmit, submitForm, loading, formState: { errors }, users } = useEditCardForm({
        onClose, handleFetchCard, cardId,
    });
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
                    {t("edit_card")}
                </h2>

                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="space-y-4"
                >
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* User */}
                        <div className="w-full">
                            <select
                                {...register("userId")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                                <option value="">  {t("select_user")} </option>
                                {users?.map((item) => (
                                    <option key={item.user_id} value={item.user_id} >
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

                        {/* Customer Number */}
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={t("discount")}
                                {...register("discount")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Card Number */}
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder={t("card_number")}
                                {...register("card_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />

                            <div className="h-5 mt-1">
                                {errors.card_number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.card_number.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* VIP Number */}
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder={t("vip_number")}
                                {...register("vip_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

                    {/* Buttons */}
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
                            {loading ? (
                                <Spinner size="5" color="white" />
                            ) : (
                                t("submit")
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCard;