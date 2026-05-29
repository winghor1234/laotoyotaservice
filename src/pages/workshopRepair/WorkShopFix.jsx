
import { useTranslation } from "react-i18next";
import CurrencyInput from "react-currency-input-field";
import { useWorkShopRepair } from "../../component/schemaValidate/workShopRepairValidate/WorkShopRepairValidate";

const WorkShopFix = ({ show, onClose }) => {
    const { t } = useTranslation("booking");
    const { register, handleSubmit, errors, submitForm, setValue, watch, cards, setIsManualPartPoint, setIsManualLabourPoint } = useWorkShopRepair();
    const labour_total = watch("labour_total") || 0;
    const part_total = watch("part_total") || 0;
    const totalPrice = Number(labour_total) + Number(part_total);

    const payment_currency = watch("payment_currency");
    const currencyText =
        payment_currency === "THB"
            ? "฿"
            : payment_currency === "USD"
                ? "$"
                : t("kip_text");

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit(submitForm)}
                className="bg-white flex flex-col gap-6 p-4 sm:p-6 rounded-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
                    {t("fix_title")}
                </h2>

                <div className="space-y-4 sm:space-y-6">
                    {/* card number */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("card_id_text")}</label>
                        <select
                            {...register('cardId')}
                            className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                        >
                            <option value="">{t("select_card")}</option>
                            {(cards || []).map((card) => (
                                <option key={card.card_id} value={card.card_id}>
                                    {card.card_number} {card.card_type}
                                </option>
                            ))}
                        </select>
                        <div className="h-6">{errors.cardId && <p className="text-red-500 text-sm">{errors.cardId.message}</p>}</div>
                    </div>
                    {/* payment type */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("payment_type_text")}</label>
                        <select
                            {...register('payment_type')}
                            className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
                        >
                            <option value="">{t("select_payment_type")}</option>
                            <option value="Cash">{t("cash")}</option>
                            <option value="Transfer">{t("transfer")}</option>
                        </select>
                        <div className="h-6">{errors.payment_type && <p className="text-red-500 text-sm">{errors.payment_type.message}</p>}</div>
                    </div>
                    {/* car info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* KM Last */}
                        <div className="flex flex-col relative">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("kmLast_text")}</label>
                            <input
                                {...register("kmLast")}
                                placeholder={t("kmLast")}
                                className=" w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                            />
                            <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg pointer-events-none">
                                {t("km_text")}
                            </span>
                            <div className="h-6">{errors.kmLast && <p className="text-red-500 text-sm">{errors.kmLast.message}</p>}</div>
                        </div>

                        {/* KM Next */}
                        <div className="flex flex-col relative">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("kmNext_text")}</label>
                            <input
                                {...register("kmNext")}
                                placeholder={t("kmNext")}
                                className="w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                            />
                            <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg pointer-events-none">
                                {t("km_text")}
                            </span>
                            <div className="h-6">{errors.kmNext && <p className="text-red-500 text-sm">{errors.kmNext.message}</p>}</div>
                        </div>
                    </div>

                    {/* Detail Fix */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("Optional_text")}</label>
                        <textarea
                            {...register("detailFix")}
                            placeholder={t("detailFix")}
                            rows={3}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors resize-none"
                        />
                    </div>

                    {/* Payment Currency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Currency */}
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("payment_currency_text")}</label>
                            <select
                                {...register("payment_currency")}
                                className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none"
                            >
                                <option value="LAK">{t("LAK")}</option>

                                <option value="THB">{t("THB")}</option>

                                <option value="USD">{t("USD")}</option>
                            </select>
                        </div>
                        {/* Exchange Rate */}
                        <div className="flex flex-col relative">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("exchange_rate_text")}</label>
                            <CurrencyInput
                                value={
                                    watch("payment_currency") === "LAK"
                                        ? ""
                                        : watch("exchange_rate")
                                }

                                disabled={
                                    watch("payment_currency") === "LAK"
                                }

                                placeholder={
                                    watch("payment_currency") === "LAK"
                                        ? t("no_exchange_Rate")
                                        : t("exchange_Rate")
                                }

                                groupSeparator=","
                                decimalsLimit={2}
                                className={`w-full py-3 sm:py-4 px-4 sm:px-6 border rounded-lg text-base sm:text-lg outline-none  ${watch("payment_currency") === "LAK"
                                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
                                    : "border-gray-300"
                                    }`}

                                onValueChange={(value) =>
                                    setValue(
                                        "exchange_rate",
                                        value ? Number(value) : ""
                                    )
                                }
                            />

                        </div>
                    </div>

                    {/* ---------------------------------------------------------------------------------------------- */}
                    {/* Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ">
                        {/* labour_total */}
                        <div className="flex flex-col relative">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("labour_text")}</label>
                            <CurrencyInput
                                {...register("labour_total")}
                                placeholder={t("labour_total_placholder")}
                                groupSeparator=","
                                decimalsLimit={0}
                                min={0}
                                className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                                onValueChange={(value) => setValue("labour_total", Number(value) || 0)}
                            />
                            <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                {currencyText}
                            </span>
                            <div className="h-6">{errors.labour_total && <p className="text-red-500 text-sm">{errors.labour_total.message}</p>}</div>
                        </div>

                        <div className="flex  items-center justify-center gap-4">
                            {/* labour_point */}
                            <div className="flex flex-col relative">
                                <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("labour_point_text")}</label>
                                <CurrencyInput
                                    readOnly
                                    value={watch("labour_point")}
                                    {...register("labour_point")}
                                    // placeholder={t("labour_point_placholder")}
                                    groupSeparator=","
                                    decimalsLimit={0}
                                    min={0}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none shadow-sm transition-colors pr-12"
                                    onValueChange={(value) => {
                                        setIsManualLabourPoint(true);
                                        setValue("labour_point", value ? Number(value) : ""
                                        );
                                    }}
                                />
                                <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                    {t("point_text")}
                                </span>
                                <div className="h-6">{errors.labour_point && <p className="text-red-500 text-sm">{errors.labour_point.message}</p>}</div>
                            </div>
                            {/*labour discount */}
                            <div className="flex flex-col relative">
                                <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("labour_discount_text")}</label>
                                <CurrencyInput
                                    value={watch("labour_discount")}
                                    {...register("labour_discount")}
                                    placeholder={t("labour_discount_placholder")}
                                    groupSeparator=","
                                    decimalsLimit={0}
                                    min={0}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                                    // decimalsLimit={0}
                                    onKeyDown={(e) => {
                                        const input = e.currentTarget;
                                        // allow control keys
                                        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) { return; }
                                        // selected text
                                        const selected = input.value.substring(input.selectionStart, input.selectionEnd);
                                        // allow replace selected text
                                        if (selected.length > 0) { return }
                                        // block if already 2 digits
                                        const rawValue = input.value.replace(/,/g, "");
                                        if (rawValue.length >= 2) { e.preventDefault(); }
                                    }}
                                    onValueChange={(value) => {
                                        setValue("labour_discount", value ? Number(value) : "");
                                    }}
                                />
                                <span className="absolute right-2 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                    %
                                </span>
                                <div className="h-6">{errors.labour_discount && <p className="text-red-500 text-sm">{errors.labour_discount.message}</p>}</div>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ">
                        {/* part total */}
                        <div className="flex flex-col relative">
                            <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_total_text")}</label>
                            <CurrencyInput
                                {...register("part_total")}
                                placeholder={t("part_total_placholder")}
                                groupSeparator=","
                                decimalsLimit={0}
                                className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                                onValueChange={(value) => setValue("part_total", Number(value) || "")}
                            />
                            <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                {currencyText}
                            </span>
                            <div className="h-6">{errors.part_total && <p className="text-red-500 text-sm">{errors.part_total.message}</p>}</div>
                        </div>
                        <div className="flex  items-center justify-center gap-4">
                            {/*part point */}
                            <div className="flex flex-col relative">
                                <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_point_text")}</label>
                                <CurrencyInput
                                    readOnly
                                    value={watch("part_point")}
                                    {...register("part_point")}
                                    // placeholder={t("part_point_placholder")}
                                    groupSeparator=","
                                    decimalsLimit={0}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none shadow-sm transition-colors pr-12"
                                    //new
                                    onValueChange={(value) => {
                                        setIsManualPartPoint(true);
                                        setValue("part_point", value ? Number(value) : "");
                                    }}
                                />
                                <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                    {t("point_text")}
                                </span>
                                <div className="h-6">{errors.part_point && <p className="text-red-500 text-sm">{errors.part_point.message}</p>}</div>
                            </div>
                            {/* part discount */}
                            <div className="flex flex-col relative">
                                <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_discount_text")}</label>
                                <CurrencyInput
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors pr-12"
                                    value={watch("part_discount")}
                                    {...register("part_discount")}
                                    placeholder={t("part_discount_placholder")}
                                    decimalsLimit={0}
                                    onKeyDown={(e) => {
                                        const input = e.currentTarget;
                                        // allow control keys
                                        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) { return; }
                                        // selected text
                                        const selected = input.value.substring(input.selectionStart, input.selectionEnd);
                                        // allow replace selected text
                                        if (selected.length > 0) { return }
                                        // block if already 2 digits
                                        const rawValue = input.value.replace(/,/g, "");
                                        if (rawValue.length >= 2) { e.preventDefault(); }
                                    }}
                                    onValueChange={(value) => {
                                        setValue("part_discount", value ? Number(value) : "");
                                    }}
                                />
                                <span className="absolute right-2 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
                                    %
                                </span>
                                <div className="h-6">
                                    {errors.part_discount && (
                                        <p className="text-red-500 text-sm">{errors.part_discount.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* totalPrice */}
                    <div className="flex flex-col relative">
                        <h2 className="text-xl text-gray-600">{t("totalPrice")}</h2>
                        <CurrencyInput
                            readOnly
                            value={totalPrice}
                            readOnly
                            placeholder={t("totalPrice")}
                            groupSeparator=","
                            decimalsLimit={0}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none shadow-sm transition-colors pr-12"
                            onValueChange={(value) => setValue("totalPrice", Number(value) || 0)}
                        />
                        <span className="absolute right-4 inset-y-0 translate-y-3 flex items-center text-gray-500 text-base sm:text-lg">
                            {currencyText}
                        </span>
                    </div>
                    {/* total Point */}
                    <div className="flex flex-col relative">
                        <h2 className="text-xl text-gray-600">{t("totalPoint")}</h2>
                        <CurrencyInput

                            value={watch("totalPoint")}
                            readOnly
                            placeholder={t("totalPoint")}
                            groupSeparator=","
                            decimalsLimit={0}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none shadow-sm transition-colors pr-12"
                            onValueChange={(value) => setValue("totalPoint", Number(value) || 0)}
                        />
                        <span className="absolute right-4 inset-y-0 translate-y-3 flex items-center text-gray-500 text-base sm:text-lg">
                            {t("point_text")}
                        </span>
                    </div>

                    {/* Total LAK */}
                    <div className="flex flex-col relative">
                        <h2 className="text-xl text-gray-600">{t("total_price_lak")}</h2>
                        <CurrencyInput
                            value={watch("total_price_lak")}
                            readOnly
                            placeholder="Total LAK"
                            groupSeparator=","
                            decimalsLimit={0}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg bg-gray-100 outline-none"
                        />
                        <span className="absolute right-4 inset-y-0 translate-y-0 flex items-center text-gray-500 text-base sm:text-lg">
                            {t("kip_text")}
                        </span>

                    </div>




                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
                    >
                        {t("submit")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WorkShopFix;