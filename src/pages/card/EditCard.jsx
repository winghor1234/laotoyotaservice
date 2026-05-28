import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useEditCardForm } from "../../component/schemaValidate/cardValidate/EditCardValidate";

const EditCard = ({ show, onClose, cardId, handleFetchCard }) => {
    const { t } = useTranslation("card");
    const {
        register,
        handleSubmit,
        submitForm,
        loading,
        formState: { errors },
        cars,
        search,
        setSearch,
        showDropdown,
        setShowDropdown,
        dropdownRef,
        handleSelectCar,
        selectedCar,
        setSelectedCar,
        currentCarId
    } = useEditCardForm({ onClose, handleFetchCard, cardId });

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

                <h2 className="text-lg sm:text-xl font-bold text-center mb-6">
                    {t("edit_card")}
                </h2>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

                    {/* ================= ROW 1: Car & Core Info ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Select Car */}
                        {/* <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("select_car")}</label>
                            <select
                                {...register("carId")}
                                className={`w-full py-2.5 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 ${errors.carId ? "border-red-500" : "border-gray-300 focus:border-red-500"
                                    }`}
                            >
                                <option value="">{t("select_car")}</option>
                                {cars?.filter((item) => { return !item.card || item.car_id === currentCarId }).map((item) => (
                                    <option key={item.car_id} value={item.car_id}>
                                        {item.frameNumber} : {item.engineNumber} - {item.model}
                                    </option>
                                ))}
                            </select>
                            <div className="h-5 mt-1">
                                {errors.carId && <p className="text-red-500 text-xs">{errors.carId.message}</p>}
                            </div>
                        </div> */}

                        <div className="flex flex-col sm:col-span-2" ref={dropdownRef}>
                            <div className="flex flex-col relative">
                                <label className="text-sm sm:text-base font-medium mb-1">
                                    {t("select_car")}
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    placeholder={t("select_car")}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setShowDropdown(true);
                                        setSelectedCar(null);
                                    }}
                                    onFocus={() => {
                                        if (!selectedCar) {
                                            setShowDropdown(true);
                                        }
                                    }}
                                    className="w-full h-[42px] sm:h-[45px] rounded-lg text-sm sm:text-base border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500"
                                />

                                {/* Hidden Input */}
                                <input type="hidden" {...register("carId")} />

                                {/* Dropdown */}
                                {showDropdown && !selectedCar && (
                                    <div className="absolute z-10 top-[68px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                                        {/* {cars
                                            .filter((car) => `${car.engineNumber} ${car.frameNumber}`.toLowerCase().includes(search.toLowerCase()),
                                            )
                                            .map((car) => (
                                                <div
                                                    key={car.car_id}
                                                    onClick={() => handleSelectCar(car)}
                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
                                                >
                                                    {car.engineNumber} {car.frameNumber} - {car.model}
                                                </div>
                                            ))} */}
                                        {cars
                                            .filter((car) => {
                                                const matchesSearch = `${car.engineNumber} ${car.frameNumber}`.toLowerCase().includes(search.toLowerCase());

                                                // เงื่อนไข: แสดงรถที่ยังไม่มีบัตร (car.card === null) 
                                                // หรือ เป็นรถคันที่กำลังแก้ไขอยู่ (car.car_id === currentCarId)
                                                const isCurrentCar = car.car_id === currentCarId;
                                                const isAvailable = !car.card || isCurrentCar;

                                                return matchesSearch && isAvailable;
                                            })
                                            .map((car) => (
                                                <div  className="px-3 py-2 text-sm cursor-pointer hover:bg-red-100" key={car.car_id} onClick={() => handleSelectCar(car)}>
                                                    {car.engineNumber} {car.frameNumber} - {car.model}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Number */}
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("card_number")}</label>
                            <input
                                type="text"
                                placeholder={t("card_number")}
                                {...register("card_number")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <div className="h-5 mt-1">
                                {errors.card_number && <p className="text-red-500 text-xs">{errors.card_number.message}</p>}
                            </div>
                        </div>

                        {/* VIP Number */}
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("vip_number")}</label>
                            <input
                                type="text"
                                placeholder={t("vip_number")}
                                {...register("vip_number")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <div className="h-5 mt-1">
                                {errors.vip_number && <p className="text-red-500 text-xs">{errors.vip_number.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ================= ROW 2: Card Details ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Card Type */}
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("card_type")}</label>
                            <input
                                type="text"
                                placeholder={t("card_type")}
                                {...register("card_type")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Received Status */}
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("received")}</label>
                            <div className="flex items-center justify-around h-[46px] border border-gray-300 rounded-lg bg-gray-50/50">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        value="yes"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span className="group-hover:text-red-600 transition-colors">{t("yes")}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        value="no"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span className="group-hover:text-red-600 transition-colors">{t("no")}</span>
                                </label>
                            </div>
                        </div>

                        {/* Count Card */}
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("count_card")}</label>
                            <input
                                type="number"
                                placeholder={t("count_card")}
                                {...register("countCard")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* ================= ROW 3: Date Settings ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("gold_issued")}</label>
                            <input
                                type="date"
                                {...register("goldIssued")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("issued_date")}</label>
                            <input
                                type="date"
                                {...register("issued_date")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-semibold text-gray-700">{t("expiration_date")}</label>
                            <input
                                type="date"
                                {...register("expiration_date")}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* ================= ACTION BUTTONS ================= */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg w-full sm:w-36 h-11 transition-all"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg w-full sm:w-36 h-11 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="5" color="white" /> : t("update_card")}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default EditCard;