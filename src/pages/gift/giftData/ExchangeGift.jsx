import { useTranslation } from "react-i18next";
import Spinner from "../../../utils/Loading";
import { useExchangeGiftForm } from "../../../component/schemaValidate/giftValidate.js/ExchangeGiftValidate";
import { useState } from "react";


const ExchangeGift = ({ show, onClose, handleFetch }) => {
    const { t } = useTranslation("gift");
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedGiftCard, setSelectedGiftCard] = useState(null);
    const { register, handleSubmit, formState: { errors }, submitForm, loading, giftCards, cards, search, setSearch, showDropdown, setShowDropdown, showGiftDropdown, setShowGiftDropdown,  cardDropdownRef, giftCardDropdownRef, giftCardSearch, setGiftCardSearch, setValue } = useExchangeGiftForm({ onClose, handleFetch });
    if (!show) return null;
    // console.log("giftCards", giftCards);
    // console.log("cards", cards);

    return (
        <>
            <div
                className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{t("exchange_gift")}</h2>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-3 sm:space-y-4">
                    {/* Inputs */}
                    <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4 ">

                        <div ref={cardDropdownRef} className="flex flex-col relative">
                            <input type="hidden" {...register("cardId")} />

                            {/* input search */}
                            <input
                                type="text"
                                value={search}
                                placeholder={t("select_card")}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedCard(null);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => {
                                    if (!selectedCard) {
                                        setShowDropdown(true);
                                    }
                                }}
                                className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
                            />

                            {/* dropdown */}
                            {showDropdown && !selectedCard && (
                                <div ref={cardDropdownRef} className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                                    {cards.filter((card) => `${card.card_number} ${card.card_type}`.toLowerCase().includes(search.toLowerCase()))
                                        .map((card) => (
                                            <div
                                                key={card.card_id}
                                                onClick={() => {
                                                    setSearch(`${card.card_number} ${card.card_type}`);

                                                    setSelectedCard(card);
                                                    setValue("cardId", card.card_id);
                                                    setShowDropdown(false);
                                                }}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600"
                                            >
                                                {card.card_number} {card.card_type} : {card.total_point}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        {/* gift */}
                        <div ref={giftCardDropdownRef} className="flex flex-col relative">
                            <input type="hidden" {...register("giftcardId")} />

                            {/* input search */}
                            <input
                                type="text"
                                value={giftCardSearch}
                                placeholder={t("select_gift")}
                                onChange={(e) => {
                                    setGiftCardSearch(e.target.value);
                                    setSelectedGiftCard(null);
                                    setShowGiftDropdown(true);
                                }}
                                onFocus={() => {
                                    if (!selectedGiftCard) {
                                        setShowGiftDropdown(true);
                                    }
                                }}
                                className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
                            />

                            {/* dropdown */}
                            {showGiftDropdown && !selectedGiftCard && (
                                <div ref={giftCardDropdownRef} className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                                    {giftCards?.filter((giftCard) => `${giftCard.gift_Name} ${giftCard.amount}`.toLowerCase().includes(giftCardSearch.toLowerCase()))
                                        .map((giftCard) => (
                                            <div
                                                key={giftCard.giftcard_id}
                                                onClick={() => {
                                                    setGiftCardSearch(`${giftCard.gift_Name}`);
                                                    setSelectedGiftCard(giftCard);
                                                    setValue("giftcardId", giftCard.giftcard_id); // ใช้ setValue แทน reset
                                                    setShowGiftDropdown(false);
                                                }}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600"
                                            >
                                                {giftCard.gift_Name} : {giftCard.gift_Point}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                {...register("amount")}
                                placeholder={t("amount")}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-1 border-gray-300 rounded-lg text-sm  outline-none hover:border-red-500 focus:border-red-600  focus:ring-red-600 shadow-sm transition-colors"
                            />
                            <div className="h-6">{errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                            }}
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
                </form >
            </div >
        </>
    );
};

export default ExchangeGift;
