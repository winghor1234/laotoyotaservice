

import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import { useExchangeGiftForm } from "../../../component/schemaValidate/giftValidate.js/ExchangeGiftValidate";
import { useState } from "react";
import { X, AlertCircle } from "lucide-react";


const ExchangeGift = ({ show, onClose, handleFetch }) => {
    const { t } = useTranslation("gift");
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedGiftCard, setSelectedGiftCard] = useState(null);
    const [pointWarning, setPointWarning] = useState("");

    const {
        register, handleSubmit, formState: { errors }, submitForm, loading,
        giftCards, cards, search, setSearch, showDropdown, setShowDropdown,
        showGiftDropdown, setShowGiftDropdown, cardDropdownRef, giftCardDropdownRef,
        giftCardSearch, setGiftCardSearch, setValue,
    } = useExchangeGiftForm({ onClose, handleFetch });

    if (!show) return null;

    // ── helpers ──────────────────────────────────────────────────────────────
    const cardPoints = selectedCard?.total_point ?? null;

    const isGiftDisabled = (giftCard) => cardPoints !== null && giftCard.gift_Point > cardPoints;

    const handleGiftSelect = (giftCard) => {
        if (isGiftDisabled(giftCard)) {
            setPointWarning(t("point_not_enough") );
            return;
        }
        setPointWarning("");
        setGiftCardSearch(`${giftCard.gift_Name} : ${giftCard.gift_Point} ${t("point")}`);
        setSelectedGiftCard(giftCard);
        setValue("giftcardId", giftCard.giftcard_id);
        setShowGiftDropdown(false);
    };

    return (
        <>
            <div
                className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{t("exchange_gift")}</h2>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">

                    {/* ── Inputs Row ── */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                        {/* ── Card Search ── */}
                        <div ref={cardDropdownRef} className="relative flex-1 min-w-0">
                            <input type="hidden" {...register("cardId")} />

                            <input
                                type="text"
                                value={search}
                                placeholder={t("select_card")}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedCard(null);
                                    setShowDropdown(true);
                                    // reset gift warning when card changes
                                    setPointWarning("");
                                    setSelectedGiftCard(null);
                                    setGiftCardSearch("");
                                    setValue("giftcardId", "");
                                }}
                                onFocus={() => {
                                    if (!selectedCard) setShowDropdown(true);
                                }}
                                className={`w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300
                                    px-3 outline-none hover:border-red-500 focus:border-red-500
                                    truncate transition-colors ${search ? "pr-8" : "pr-3"}`}
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setValue("cardId", "");
                                        setSelectedCard(null);
                                        setShowDropdown(true);
                                        setPointWarning("");
                                        setSelectedGiftCard(null);
                                        setGiftCardSearch("");
                                        setValue("giftcardId", "");
                                    }}
                                    className="absolute right-2 top-2/5 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {showDropdown && !selectedCard && (
                                <div className="absolute z-10 top-full  w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto shadow-md">
                                    {cards
                                        .filter((card) =>
                                            `${card.card_number} ${card.card_type}`
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        )
                                        .map((card) => (
                                            <div
                                                key={card.card_id}
                                                onClick={() => {
                                                    setSearch(`${card.card_number} ${card.card_type} : ${card.total_point} ${t("point")}`);
                                                    setSelectedCard(card);
                                                    setValue("cardId", card.card_id);
                                                    setShowDropdown(false);
                                                }}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600 hover:text-white truncate border-b border-gray-100 last:border-b-0 transition-colors"
                                                title={`${card.card_number} ${card.card_type}`}
                                            >
                                                {card.card_number} {card.card_type} : {card.total_point} {t("point")}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* ── Gift Card Search ── */}
                        <div ref={giftCardDropdownRef} className="relative flex-1 min-w-0">
                            <input type="hidden" {...register("giftcardId")} />

                            <input
                                type="text"
                                value={giftCardSearch}
                                placeholder={t("select_gift")}
                                onChange={(e) => {
                                    setGiftCardSearch(e.target.value);
                                    setSelectedGiftCard(null);
                                    setShowGiftDropdown(true);
                                    setPointWarning("");
                                }}
                                onFocus={() => {
                                    if (!selectedGiftCard) setShowGiftDropdown(true);
                                }}
                                className={`w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300
                                    px-3 outline-none hover:border-red-500 focus:border-red-500
                                    truncate transition-colors ${giftCardSearch ? "pr-8" : "pr-3"}`}
                            />

                            {giftCardSearch && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGiftCardSearch("");
                                        setValue("giftcardId", "");
                                        setSelectedGiftCard(null);
                                        setShowGiftDropdown(true);
                                        setPointWarning("");
                                    }}
                                    className="absolute right-2 top-2/5 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {/* Point warning */}
                            {pointWarning && (
                                <div className="mt-1 flex items-start gap-1 text-xs text-red-500">
                                    <AlertCircle size={13} className="mt-px shrink-0" />
                                    <span>{pointWarning}</span>
                                </div>
                            )}

                            {showGiftDropdown && !selectedGiftCard && (
                                <div className="absolute z-10 top-full  w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto shadow-md">
                                    {giftCards
                                        ?.filter((giftCard) =>
                                            `${giftCard.gift_Name} ${giftCard.amount} `
                                                .toLowerCase()
                                                .includes(giftCardSearch.toLowerCase())
                                        )
                                        .map((giftCard) => {
                                            const disabled = isGiftDisabled(giftCard);
                                            return (
                                                <div
                                                    key={giftCard.giftcard_id}
                                                    onClick={() => handleGiftSelect(giftCard)}
                                                   
                                                    className={`
                                                        px-3 py-2 text-sm border-b border-gray-100 last:border-b-0
                                                        flex items-center justify-between gap-2 transition-colors
                                                        ${disabled
                                                            ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                                                            : "cursor-pointer hover:bg-red-600 hover:text-white"
                                                        }
                                                    `}
                                                >
                                                    <span className="truncate">
                                                        {giftCard.gift_Name} : {giftCard.gift_Point} {t("point")}
                                                    </span>
                                                    {disabled && (
                                                        <span className="shrink-0 text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                            {t("point_not_enough")}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* ── Amount ── */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <input
                                {...register("amount")}
                                placeholder={t("amount")}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm
                                    outline-none hover:border-red-500 focus:border-red-600
                                    shadow-sm transition-colors"
                            />
                            <div className="h-5 mt-0.5">
                                {errors.amount && (
                                    <p className="text-red-500 text-xs">{errors.amount.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Buttons ── */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg
                                w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg
                                w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm
                                flex items-center justify-center gap-2"
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

export default ExchangeGift;