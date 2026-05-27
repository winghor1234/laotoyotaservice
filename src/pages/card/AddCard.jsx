import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useAddCardForm } from "../../component/schemaValidate/cardValidate/AddCardValidate";

const AddCard = ({ show, onClose, handleFetchCard }) => {
    const { t } = useTranslation("card");
    const { register, handleSubmit, loading, onSubmit, formState: { errors }, cars, } = useAddCardForm({ onClose, handleFetchCard });
    if (!show) return null;
    return (
        <>,
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Car */}
                        <div>
                            <label>{t("select_car")}</label>
                            <select
                                {...register("carId")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            >
                                <option value="">{t("select_car")}</option>
                                {cars?.filter((item) => !item.card).map((item) => (
                                    <option key={item.car_id} value={item.car_id}>
                                        {item.frameNumber} : {item.engineNumber} - {item.model}
                                    </option>
                                ))}
                            </select>
                            <div className="h-5 mt-1">
                                {errors.carId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.carId.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Card Number */}
                        <div>
                            <label>{t("card_number")}</label>
                            <input
                                type="text"
                                placeholder={t("card_number")}
                                {...register("card_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
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
                        <div>
                            <label>{t("vip_number")}</label>
                            <input
                                type="text"
                                placeholder={t("vip_number")}
                                {...register("vip_number")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Card Type */}
                        <div>
                            <label>{t("card_type")}</label>
                            <input
                                type="text"
                                placeholder={t("card_type")}
                                {...register("card_type")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <div className="h-5 mt-1"></div>
                        </div>

                        {/* Received */}
                        <div>
                            <label className="block">{t("received")}</label>
                            <div className="flex items-center justify-center gap-8 h-12 border border-gray-300 rounded-lg"> {/* ความสูง h-12 เพื่อให้บาลานซ์กับช่อง Input ข้างๆ */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="yes"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span>ໄດ້ຮັບແລ້ວ</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="no"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span>ຍັງບໍ່ໄດ້ຮັບ</span>
                                </label>
                            </div>
                            <div className="h-5 mt-1"></div>
                        </div>

                        {/* Count Card */}
                        <div>
                            <label>{t("count_card")}</label>
                            <input
                                type="number"
                                placeholder={t("count_card")}
                                {...register("countCard")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <div className="h-5 mt-1"></div>
                        </div>
                    </div>

                    {/* GROUP 3: Points System (จัดเรียง 4 คอลัมน์บนจอใหญ่) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Active Point */}
                        {/* <div>
                            <label>{t("active_point")}</label>
                            <input
                                type="number"
                                placeholder={t("active_point")}
                                {...register("active_point")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div> */}

                        {/* Total Point */}
                        {/* <div>
                            <label>{t("total_point")}</label>
                            <input
                                type="number"
                                placeholder={t("total_point")}
                                {...register("total_point")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div> */}

                        {/* Running Part */}
                        {/* <div>
                            <label>{t("running_part")}</label>
                            <input
                                type="number"
                                placeholder={t("running_part")}
                                {...register("running_part")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div> */}

                        {/* Running Labour */}
                        {/* <div>
                            <label>{t("running_labour")}</label>
                            <input
                                type="number"
                                placeholder={t("running_labour")}
                                {...register("running_labour")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div> */}
                    </div>

                    {/* GROUP 4: Dates & Timelines (จัดเรียง 3 คอลัมน์บนจอใหญ่) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Gold Issued */}
                        <div>
                            <label>{t("gold_issued")}</label>
                            <input
                                type="date"
                                placeholder={t("gold_issued")}
                                {...register("goldIssued")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Issued Date */}
                        <div>
                            <label>{t("issued_date")}</label>
                            <input
                                type="date"
                                placeholder={t("issued_date")}
                                {...register("issued_date")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label>{t("expiration_date")}</label>
                            <input
                                type="date"
                                placeholder={t("expiration_date")}
                                {...register("expiration_date")}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg  focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* ================= BUTTONS ================= */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-4">
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