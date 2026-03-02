import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, ChevronDown, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";



export default function SelectDate({
    placeholder = "ຄົ້ນຫາ...",
    onDateChange,
    searchValue,
    onSearchChange,
}) {
    const { t } = useTranslation("util");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        onDateChange?.({ startDate: date, endDate });
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        onDateChange?.({ startDate, endDate: date });
    };


    // console.log("Selected Start Date:", startDate);
    // console.log("Selected End Date:", endDate);

    const handleIconClick = (ref) => {
        if (ref.current) ref.current.setFocus();
    };
    const handleChange = (e) => {
        onSearchChange(e.target.value);
    };

    const clearStartDate = () => {
        setStartDate(null);
        onDateChange?.({ startDate: null, endDate });
    };

    const clearEndDate = () => {
        setEndDate(null);
        onDateChange?.({ startDate, endDate: null });
    };

    const clearSearch = () => {
        onSearchChange("");
    };

    const clearAll = () => {
        setStartDate(null);
        setEndDate(null);
        onDateChange?.({ startDate: null, endDate: null });
        onSearchChange("");
    };
    const isDisabled = !startDate && !endDate && !searchValue;

    return (
        <div className="flex flex-col sm:flex-row sm:justify-start lg:justify-start flex-wrap gap-2 sm:gap-3 lg:gap-5 flex-1">
            {/* Start Date */}
            <div className="flex items-center justify-between min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
                <div className="flex items-center gap-2 flex-1">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_start")}</span>
                    <div className="relative flex-1">
                        <DatePicker
                            ref={startDateRef}
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_start_placeholder")}
                            className="w-full outline-none cursor-pointer bg-transparent font-semibold"
                        />

                        {startDate ? (
                            <X
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-gray-500"
                                onClick={clearStartDate}
                            />
                        ) : (
                            <ChevronDown
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                                onClick={() => handleIconClick(startDateRef)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* End Date */}
            <div className="flex items-center justify-between min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
                <div className="flex items-center gap-2 flex-1">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_start")}</span>
                    <div className="relative flex-1">
                        <DatePicker
                            ref={endDateRef}
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_end_placeholder")}
                            className="w-full outline-none cursor-pointer bg-transparent font-semibold"
                        />

                        {endDate ? (
                            <X
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-gray-500"
                                onClick={clearEndDate}
                            />
                        ) : (
                            <ChevronDown
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                                onClick={() => handleIconClick(endDateRef)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center relative min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 focus-within:border-blue-600 px-3 py-2 bg-white shadow-sm rounded">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="outline-none text-sm sm:text-base flex-1 focus:caret-red-600"
                />
                {searchValue && (
                    <X
                        className="absolute right-3 w-5 h-5 cursor-pointer text-gray-500"
                        onClick={clearSearch}
                    />
                )}
            </div>
            <button
                onClick={clearAll}
                disabled={isDisabled}
                className={` px-4 py-2 rounded text-sm font-medium text-white duration-200 ${isDisabled
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-400"
                    }`}
            >
                Clear All
            </button>
        </div>
    );
}


