import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import ExportExcelButton from "./ExcelExportButton";
import { useTranslation } from "react-i18next";



const BookingSearch = ({ onSearch , exportData, }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchText, setSearchText] = useState("");
    const { t } = useTranslation("util");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ searchText, startDate, endDate });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6"
        >
            {/* Start Date */}
            <div className="flex items-center justify-between min-w-[200px] sm:w-auto  h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
                <div className="flex items-center gap-2 flex-1">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_start")}</span>
                    <div className="relative flex-1">
                        <DatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_start_placeholder")}
                            className="w-full outline-none cursor-pointer bg-transparent font-semibold text-sm sm:text-base lg:text-md"
                        />
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* End Date */}
            <div className="flex items-center justify-between min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
                <div className="flex items-center gap-2 flex-1">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_end")}</span>
                    <div className="relative flex-1">
                        <DatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={t("date_end_placeholder")}
                            className="w-full outline-none cursor-pointer bg-transparent font-semibold text-sm sm:text-base lg:text-md"
                        />
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 focus-within:border-blue-600 px-3 py-2 bg-white shadow-sm rounded">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" />
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="outline-none text-sm sm:text-base flex-1"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 transition-colors w-full sm:w-auto px-6 py-2.5 sm:py-3 text-white rounded-xl font-medium text-sm sm:text-base"
                >
                    {t("search")}
                </button>
                <ExportExcelButton data={exportData} />
                {/* <ImportExcel fetchTime={fetchBooking} addToExport={setExportData} /> */}

            </div>
        </form>
    );
};

export default BookingSearch;
