import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useAddCardForm } from "../../component/schemaValidate/cardValidate/AddCardValidate";
import { useState } from "react";
import { formatCardNumber } from "../../utils/GenerateCardNumber";
import { X } from "lucide-react";

const AddCard = ({ show, onClose, handleFetchCard }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const { t } = useTranslation("card");
    const { register, handleSubmit, loading, onSubmit, setValue, formState: { errors }, cars, search, setSearch, showDropdown, setShowDropdown, dropdownRef } = useAddCardForm({ onClose, handleFetchCard });

    const handleGenerateCode = () => {
        let maxNumber = 0;

        if (cars && cars.length > 0) {
            const numbers = cars
                .map(c => {
                    // ต้องดึงจาก c.card.card_number เพราะ Card เป็น relation ของ Car
                    const rawCardNumber = c.card?.card_number;

                    if (rawCardNumber && typeof rawCardNumber === 'string' && rawCardNumber.startsWith('VLTS')) {
                        const numStr = rawCardNumber.replace('VLTS', '');
                        const num = parseInt(numStr, 10);
                        return isNaN(num) ? 0 : num;
                    }
                    return 0;
                });

            if (numbers.length > 0) {
                maxNumber = Math.max(...numbers);
            }
        }

        const formattedCode = formatCardNumber(maxNumber);
        setValue("card_number", formattedCode, { shouldValidate: true });
    };
    if (!show) return null;
    // console.log(cars);
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* --- แถวที่ 1 --- */}
                        {/* เลือกพนักงาน/รถ (ให้กว้าง 2 ส่วนบนจอใหญ่) */}
                        <div ref={dropdownRef} className="md:col-span-2 flex flex-col relative">
                            <label className="text-sm font-medium mb-1 block">
                                {t("select_car")}
                            </label>
                            <input type="hidden" {...register("carId")} />
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={search}
                                    placeholder={t("select_car")}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setSelectedCar(null);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => !selectedCar && setShowDropdown(true)}
                                    className="w-full h-[48px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500 transition-all"
                                />
                                {/* ปุ่มสำหรับลบข้อมูล (แสดงเมื่อมีค่าใน search เท่านั้น) */}
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setValue("carId", "");
                                            setSelectedCar(null);
                                            setShowDropdown(true);
                                        }}
                                        className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <X />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown */}
                            {showDropdown && !selectedCar && (
                                <div className="absolute z-20 top-[75px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow-lg">
                                    {cars
                                        .filter((car) =>
                                            !car.card && car.userId && `${car.engineNumber} ${car.frameNumber}`
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        )
                                        .map((car) => (
                                            <div
                                                key={car.car_id}
                                                onClick={() => {
                                                    setSearch(`${car.engineNumber} ${car.frameNumber}`);
                                                    setSelectedCar(car);
                                                    setValue("carId", car.car_id);
                                                    setShowDropdown(false);
                                                }}
                                                className="px-3 py-3 text-sm cursor-pointer hover:bg-red-50 border-b last:border-none"
                                            >
                                                {car.engineNumber} | {car.frameNumber}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* ช่องกรอกเลขบัตร + ปุ่ม GEN */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">{t("card_number")}</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={t("card_number")}
                                    {...register("card_number")}
                                    className={`flex-grow h-[48px] px-4 border rounded-lg focus:outline-none transition-all ${errors.card_number ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateCode}
                                    className="h-[48px] px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                                >
                                    {t("genCode")}
                                </button>
                            </div>
                            {errors.card_number && <p className="text-red-500 text-xs mt-1">{errors.card_number.message}</p>}
                        </div>

                        {/* --- แถวที่ 2 --- */}
                        {/* ประเภทบัตร (Card Type) */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">
                                {t("card_type")}
                            </label>
                            <select
                                {...register("card_type")}
                                className={`w-full h-[48px] px-4 border rounded-lg focus:outline-none transition-all bg-white appearance-none ${errors.card_type ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                                    }`}
                            >
                                {/* ตัวเลือกเริ่มต้น (Placeholder) */}
                                <option value="">{t("select_card_type")}</option>

                                {/* รายการประเภทบัตร - คุณสามารถปรับเปลี่ยน value ตาม Database ของคุณ */}
                                <option value="Gold">{t("gold_card")}</option>
                                <option value="Silver">{t("silver_card")}</option>
                            </select>

                            {/* แสดง Error Message (ถ้ามี) */}
                            {errors.card_type && (
                                <p className="text-red-500 text-xs mt-1">{errors.card_type.message}</p>
                            )}
                        </div>

                        {/* สถานะการรับ */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">{t("received")}</label>
                            <div className="flex items-center justify-around h-[48px] border border-gray-300 rounded-lg bg-gray-50/50">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        value="yes"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span className="text-sm group-hover:text-red-600 transition-colors">ໄດ້ຮັບແລ້ວ</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        value="no"
                                        {...register("received")}
                                        className="w-4 h-4 accent-red-600"
                                    />
                                    <span className="text-sm group-hover:text-red-600 transition-colors">ຍັງບໍ່ໄດ້ຮັບ</span>
                                </label>
                            </div>
                        </div>

                        {/* วันหมดอายุ */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">{t("expiration_date")}</label>
                            <input
                                type="date"
                                {...register("expiration_date")}
                                className="w-full h-[48px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* ================= BUTTONS ================= */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="order-2 sm:order-1 bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="submit"
                            className="order-1 sm:order-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
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